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
} );
