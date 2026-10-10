/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Code highlighting', () => {
	// wp-env activates every listed plugin, including the Classic Editor, on a fresh environment.
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin( 'classic-editor' );
	} );

	test( 'WordPress-specific syntax should be highlighted on the block editor', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		await expect( editor.canvas.locator( '[data-type="core/html"] .monaco-editor' ) ).toBeVisible();

		// The tokenizer is registered to the monaco instance loaded in the editor canvas iframe.
		const tokens = await page
			.locator( 'iframe[name="editor-canvas"]' )
			.evaluate( async ( iframe ) => {
				const { monaco } = ( iframe as HTMLIFrameElement ).contentWindow as Window;
				// The shortcode follows text to check that the text rule stops at `[`.
				const text = '<!-- wp:separator /--> [gallery ids="1"]';
				// Wait for the tokenizer, which is created lazily.
				await monaco?.editor.colorize( text, 'html', {} );
				return monaco?.editor
					.tokenize( text, 'html' )[ 0 ]
					.map( ( { offset, type }, index, lineTokens ) => [
						text.slice( offset, lineTokens[ index + 1 ]?.offset ),
						type,
					] );
			} );

		expect( tokens ).toEqual( [
			[ '<!--', 'delimiter.html' ],
			[ ' ', '' ],
			[ 'wp:separator', 'type.html' ],
			[ ' ', '' ],
			[ '/-->', 'delimiter.html' ],
			[ ' ', '' ],
			[ '[', 'delimiter.html' ],
			[ 'gallery', 'keyword.flow.html' ],
			[ ' ', '' ],
			[ 'ids', 'attribute.name.html' ],
			[ '=', 'delimiter.html' ],
			[ '"1"', 'attribute.value.html' ],
			[ ']', 'delimiter.html' ],
		] );
	} );

	test( 'WordPress-specific syntax should be highlighted in PHP on the theme editor', async ( {
		admin,
		page,
	} ) => {
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
		await admin.visitAdminPage( 'theme-editor.php' );
		await expect( page.locator( '#monaco-editor .monaco-editor' ) ).toBeVisible();

		const tokens = await page.evaluate( async () => {
			const { monaco } = window;
			// PHP code in the block attributes is embedded in JSON.
			const text = '<!-- wp:image {"id":<?php echo $id; ?>} --> [gallery]';
			// Wait for the tokenizer, which is created lazily.
			await monaco?.editor.colorize( text, 'php', {} );
			return (
				monaco?.editor
					.tokenize( text, 'php' )[ 0 ]
					.map( ( { offset, type }, index, lineTokens ) => [
						text.slice( offset, lineTokens[ index + 1 ]?.offset ),
						type,
					] )
					// Ignore whitespace and JSON, which is tokenized by the embedded language.
					.filter( ( [ , type ] ) => /\.(html|php)$/.test( type ) )
			);
		} );

		expect( tokens ).toEqual( [
			[ '<!--', 'delimiter.html' ],
			[ 'wp:image', 'type.html' ],
			[ '<?php', 'metatag.php' ],
			[ 'echo', 'keyword.php' ],
			[ '$id', 'variable.php' ],
			[ ';', 'delimiter.php' ],
			[ '?>', 'metatag.php' ],
			[ '-->', 'delimiter.html' ],
			[ '[', 'delimiter.html' ],
			[ 'gallery', 'keyword.flow.html' ],
			[ ']', 'delimiter.html' ],
		] );
	} );

	test( 'block delimiters and tags should not be colorized as bracket pairs on the theme editor', async ( {
		admin,
		page,
	} ) => {
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
		await admin.visitAdminPage( 'theme-editor.php' );
		await expect( page.locator( '#monaco-editor .monaco-editor' ) ).toBeVisible();

		await page.evaluate( () => {
			const { monaco, editor } = window;
			editor?.setModel(
				monaco?.editor.createModel( '<!-- wp:group {"layout":{}} -->\n<div></div>', 'html' ) ?? null
			);
		} );

		// Only the brackets in the block attributes are colorized.
		await expect
			.poll( async () =>
				(
					await page
						.locator( '#monaco-editor .view-line [class*="bracket-highlighting"]' )
						.allTextContents()
				).join( '' )
			)
			.toBe( '{{}}' );
	} );

	test( 'matching block delimiters should be highlighted on the theme editor', async ( {
		admin,
		page,
	} ) => {
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
		await admin.visitAdminPage( 'theme-editor.php' );
		await expect( page.locator( '#monaco-editor .monaco-editor' ) ).toBeVisible();

		await page.evaluate( () => {
			const { monaco, editor } = window;
			editor?.setModel(
				monaco?.editor.createModel(
					[
						'<!-- wp:group -->',
						'<!-- wp:paragraph --><p>Hello</p><!-- /wp:paragraph -->',
						'<!-- /wp:group -->',
					].join( '\n' ),
					'html'
				) ?? null
			);
		} );

		const getHighlightedBlockNames = ( lineNumber: number, column: number ) =>
			page.evaluate(
				( position ) => {
					const { editor } = window;
					editor?.setPosition( position );
					const model = editor?.getModel();
					return (
						model
							?.getAllDecorations()
							.filter( ( { options } ) => 'bracket-match' === options.className )
							.map( ( { range } ) => [ range.startLineNumber, model.getValueInRange( range ) ] )
							// Exclude `<!--` and `-->`, which are highlighted as matching brackets.
							.filter( ( [ , text ] ) => String( text ).startsWith( 'wp:' ) )
					);
				},
				{ lineNumber, column }
			);

		// On the opening delimiter of `wp:group`.
		await expect
			.poll( () => getHighlightedBlockNames( 1, 8 ) )
			.toEqual( [
				[ 1, 'wp:group' ],
				[ 3, 'wp:group' ],
			] );
		// On the closing delimiter of `wp:paragraph`.
		await expect
			.poll( () => getHighlightedBlockNames( 2, 45 ) )
			.toEqual( [
				[ 2, 'wp:paragraph' ],
				[ 2, 'wp:paragraph' ],
			] );
	} );

	test( 'unpaired block delimiters should be reported on the theme editor', async ( {
		admin,
		page,
	} ) => {
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
		await admin.visitAdminPage( 'theme-editor.php' );
		await expect( page.locator( '#monaco-editor .monaco-editor' ) ).toBeVisible();

		await page.evaluate( () => {
			const { monaco, editor } = window;
			editor?.setModel(
				monaco?.editor.createModel(
					[
						'<!-- wp:group -->',
						'<!-- wp:paragraph --><p>Hello</p>',
						'<!-- /wp:group -->',
						'<!-- wp:separator /-->',
						'<!-- /wp:quote -->',
					].join( '\n' ),
					'html'
				) ?? null
			);
		} );

		await expect
			.poll( () =>
				page.evaluate( () =>
					window.monaco?.editor
						.getModelMarkers( { owner: 'custom-html-block-extension' } )
						.map( ( { startLineNumber, message } ) => [ startLineNumber, message ] )
				)
			)
			.toEqual( [
				[ 2, 'Block "wp:paragraph" is not closed.' ],
				[ 5, 'Block "wp:quote" is closed without being opened.' ],
			] );
	} );

	test( 'JSON schema should be loaded on the theme editor', async ( { admin, page } ) => {
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
		await admin.visitAdminPage( 'theme-editor.php', 'file=theme.json' );
		await expect( page.locator( '#monaco-editor .monaco-editor' ) ).toBeVisible();

		// `version` must be an integer in the theme.json schema.
		await page.evaluate( () => {
			const model = window.editor?.getModel();
			model?.setValue( model.getValue().replace( /"version":\s*\d+/, '"version": "3"' ) );
		} );

		await expect
			.poll( () =>
				page.evaluate( () =>
					window.monaco?.editor.getModelMarkers( {} ).map( ( { message } ) => message )
				)
			)
			.toContain( 'Incorrect type. Expected "integer".' );
	} );

	test( 'JSON schema should be loaded when `$schema` is changed on the theme editor', async ( {
		admin,
		page,
	} ) => {
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
		await admin.visitAdminPage( 'theme-editor.php', 'file=theme.json' );
		await expect( page.locator( '#monaco-editor .monaco-editor' ) ).toBeVisible();

		// Change `$schema` and `version` at once so that the error is reported only by the new schema.
		await page.evaluate( () => {
			const model = window.editor?.getModel();
			model?.setValue(
				model
					.getValue()
					.replace(
						/"\$schema":\s*"[^"]*"/,
						'"$schema": "https://schemas.wp.org/wp/6.6/theme.json"'
					)
					.replace( /"version":\s*\d+/, '"version": "3"' )
			);
		} );

		await expect
			.poll( () =>
				page.evaluate( () =>
					window.monaco?.editor.getModelMarkers( {} ).map( ( { message } ) => message )
				)
			)
			.toContain( 'Incorrect type. Expected "integer".' );
	} );
} );
