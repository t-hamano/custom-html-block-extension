/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const LOADER_SCRIPT = '**/monaco-editor/min/vs/loader.js';
const SCRIPT_ERROR = 'Failed to load the editor script.';

test.describe( 'Editor loader', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin( 'classic-editor' );
	} );

	test.afterEach( async ( { page } ) => {
		await page.unrouteAll( { behavior: 'ignoreErrors' } );
	} );

	test( 'editors mounted while loading should share the same loading', async ( {
		admin,
		page,
		editor,
	} ) => {
		// Hold the editor script until both blocks are mounted.
		let releaseScript!: () => void;
		const scriptReleased = new Promise< void >( ( resolve ) => ( releaseScript = resolve ) );
		let scriptRequests = 0;
		await page.route( LOADER_SCRIPT, async ( route ) => {
			scriptRequests++;
			await scriptReleased;
			await route.continue();
		} );

		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		await editor.insertBlock( { name: 'core/html' } );
		releaseScript();

		await expect( editor.canvas.locator( '[data-type="core/html"] .monaco-editor' ) ).toHaveCount(
			2
		);
		expect( scriptRequests ).toBe( 1 );
	} );

	test( 'all editors should show the error when the editor script fails to load', async ( {
		admin,
		page,
		editor,
	} ) => {
		const pageErrors: Error[] = [];
		page.on( 'pageerror', ( error ) => pageErrors.push( error ) );

		// Hold the editor script until both blocks are mounted, then fail it.
		let releaseScript!: () => void;
		const scriptReleased = new Promise< void >( ( resolve ) => ( releaseScript = resolve ) );
		await page.route( LOADER_SCRIPT, async ( route ) => {
			await scriptReleased;
			await route.abort();
		} );

		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		await editor.insertBlock( { name: 'core/html' } );
		releaseScript();

		await expect( editor.canvas.getByText( SCRIPT_ERROR ) ).toHaveCount( 2 );
		// The failure should not cause an unhandled promise rejection.
		expect( pageErrors ).toEqual( [] );
	} );

	test( 'editor should retry loading after the editor script failed to load', async ( {
		admin,
		page,
		editor,
	} ) => {
		// Fail only the first request of the editor script.
		await page.route( LOADER_SCRIPT, ( route ) => route.abort(), { times: 1 } );

		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		await expect( editor.canvas.getByText( SCRIPT_ERROR ) ).toBeVisible();

		// A newly mounted editor loads the editor script again.
		await editor.insertBlock( { name: 'core/html' } );
		await expect(
			editor.canvas.locator( '[data-type="core/html"]' ).nth( 1 ).locator( '.monaco-editor' )
		).toBeVisible();
	} );
} );
