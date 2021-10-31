/**
 * WordPress dependencies
 */
import { visitAdminPage } from '@wordpress/e2e-test-utils';

const page = global.page;

export const dismissPointer = async () => {
	await page.waitForTimeout( 1000 );
	const [ wpPointer ] = await page.$$( '#wp-pointer-0' );
	if ( wpPointer ) {
		const [ dismissButton ] = await page.$$( '#wp-pointer-0 a.close' );
		await dismissButton.click();
	}
};

export const createNewClassicPost = async () => {
	await visitAdminPage( 'post-new.php' );
	await page.waitForSelector( '#post-body' );
};

export const clickButtonWithId = async ( id ) => {
	const xPath = `//*[@id="${ id }"]`;
	await page.waitForXPath( xPath );
	const elements = await page.$x( xPath );
	if ( elements[ 0 ] ) {
		await elements[ 0 ].click();
	}
};

export const expandAdminMenu = async () => {
	await page.waitForSelector( '#collapse-button' );
	const [ collapseButton ] = await page.$$( '#collapse-button[aria-expanded="false"]' );
	if ( collapseButton ) {
		await collapseButton.click();
	}
};

export const clickAdminTopMenuWithText = async ( text, index = 0 ) => {
	const xPath = `//ul[@id="adminmenu"]//a[contains(@class, 'menu-top')][contains(.,"${ text }")]`;
	await page.waitForXPath( xPath );
	const elements = await page.$x( xPath );
	if ( elements[ index ] ) {
		await elements[ index ].click();
	}
};

export const clickAdminSubMenuWithText = async ( text, index = 0 ) => {
	const xPath = `//ul[@id="adminmenu"]//ul[contains(@class, 'wp-submenu')]//a[text()="${ text }"]`;
	await page.waitForXPath( xPath );
	const elements = await page.$x( xPath );
	if ( elements[ index ] ) {
		await elements[ index ].click();
	}
};
