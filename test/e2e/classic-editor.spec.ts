/**
 * External dependencies
 */
import type { Page } from '@playwright/test';

/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

// Long enough that the cursor is out of the viewport when the page is scrolled to the top.
const CONTENT = Array.from( { length: 100 }, ( _, i ) => `<p>Line ${ i + 1 }</p>` ).join( '\n' );

function getEditorValue( page: Page ) {
	return page.evaluate( () => window.editor?.getValue() );
}

function getCursorPosition( page: Page ) {
	return page.evaluate( () => {
		const position = window.editor?.getPosition();
		return position && { lineNumber: position.lineNumber, column: position.column };
	} );
}

test.describe( 'Classic editor', () => {
	let postId: number;

	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activatePlugin( 'classic-editor' );
	} );

	test.beforeEach( async ( { admin, page, requestUtils } ) => {
		// Hide WP pointer.
		await page.addLocatorHandler( page.locator( '#wp-pointer-0' ), async ( wpPointer ) => {
			await wpPointer.locator( 'a.close' ).click();
		} );

		// Switch to the text mode so that the post is opened in it.
		await admin.visitAdminPage( 'post-new.php' );
		await page.locator( '#content-tmce' ).click();
		await page.locator( '#content-html' ).click();
		await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();

		( { id: postId } = await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/posts',
			data: { content: CONTENT },
		} ) );
	} );

	test.afterEach( async ( { admin, page } ) => {
		// Switch back to the visual mode, which is saved on the next page load.
		await admin.visitAdminPage( 'post-new.php' );
		await page.locator( '#content-tmce' ).click();
		await admin.visitAdminPage( 'index.php' );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
		await requestUtils.deleteAllMedia();
		await requestUtils.deactivatePlugin( 'classic-editor' );
	} );

	test( 'should keep the cursor position after saving', async ( { admin, page } ) => {
		await admin.visitAdminPage( 'post.php', `post=${ postId }&action=edit` );
		await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();

		await page.evaluate( () => {
			window.editor?.setPosition( { lineNumber: 80, column: 4 } );
			window.editor?.focus();
		} );
		// Monaco determines the modifier key from the user agent, not from the OS running the test.
		const isMac = await page.evaluate( () => window.navigator.userAgent.includes( 'Macintosh' ) );
		await Promise.all( [
			page.waitForURL( /message=/ ),
			page.keyboard.press( isMac ? 'Meta+s' : 'Control+s' ),
		] );

		await expect.poll( () => getCursorPosition( page ) ).toEqual( { lineNumber: 80, column: 4 } );
		await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toHaveClass( /focused/ );
		await expect( page.locator( '.chbe-monaco-editor .cursors-layer .cursor' ) ).toBeInViewport();

		// The saved position is restored only once.
		await page.reload();
		await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();
		await expect.poll( () => getCursorPosition( page ) ).toEqual( { lineNumber: 1, column: 1 } );
	} );

	test( 'should apply quicktags to the editor', async ( { admin, page } ) => {
		await admin.visitAdminPage( 'post.php', `post=${ postId }&action=edit` );
		await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();

		// Select "Line 1".
		await page.evaluate( () => {
			window.editor?.setSelection( {
				startLineNumber: 1,
				startColumn: 4,
				endLineNumber: 1,
				endColumn: 10,
			} );
		} );
		await page.locator( '#qt_content_strong' ).click();

		await expect
			.poll( () => getEditorValue( page ) )
			.toMatch( /^<p><strong>Line 1<\/strong><\/p>\n<p>Line 2<\/p>/ );
	} );

	test( 'should apply links inserted from the link dialog to the editor', async ( {
		admin,
		page,
	} ) => {
		await admin.visitAdminPage( 'post.php', `post=${ postId }&action=edit` );
		await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();

		// Select "Line 2".
		await page.evaluate( () => {
			window.editor?.setSelection( {
				startLineNumber: 2,
				startColumn: 4,
				endLineNumber: 2,
				endColumn: 10,
			} );
		} );
		await page.locator( '#qt_content_link' ).click();
		await page.locator( '#wp-link-url' ).fill( 'https://example.com' );
		await page.locator( '#wp-link-url' ).press( 'Enter' );

		await expect
			.poll( () => getEditorValue( page ) )
			.toContain( '<p><a href="https://example.com">Line 2</a></p>' );
	} );

	test( 'should apply media inserted from the media modal to the editor', async ( {
		admin,
		page,
		requestUtils,
	} ) => {
		await requestUtils.uploadMedia( 'assets/images/admin/editor-config/editor-options/rulers.gif' );
		await admin.visitAdminPage( 'post.php', `post=${ postId }&action=edit` );
		await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();

		// Place the cursor at the end of line 3.
		await page.evaluate( () => {
			window.editor?.setPosition( { lineNumber: 3, column: 14 } );
		} );
		await page.locator( '#insert-media-button' ).click();
		await page.getByRole( 'tab', { name: 'Media Library' } ).click();
		await page.locator( '.media-modal .attachments .attachment' ).first().click();
		await page.locator( '.media-modal .media-button-insert' ).click();

		// The attachment is inserted after an Ajax request.
		await expect
			.poll( () => getEditorValue( page ) )
			.toMatch( /<p>Line 3<\/p><img [^>]*rulers[^>]*>\n<p>Line 4<\/p>/ );
	} );

	test( 'should keep the content when switching between the visual and text modes', async ( {
		admin,
		page,
	} ) => {
		await admin.visitAdminPage( 'post.php', `post=${ postId }&action=edit` );
		await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();

		await page.evaluate( () => window.editor?.setValue( 'Hello <strong>World</strong>' ) );

		await page.locator( '#content-tmce' ).click();
		await expect( page.locator( '.chbe-monaco-editor' ) ).toHaveCount( 0 );
		await expect( page.frameLocator( '#content_ifr' ).locator( '#tinymce strong' ) ).toHaveText(
			'World'
		);

		await page.locator( '#content-html' ).click();
		await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();
		await expect.poll( () => getEditorValue( page ) ).toBe( 'Hello <strong>World</strong>' );
	} );
} );
