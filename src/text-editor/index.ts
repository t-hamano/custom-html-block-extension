/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import TextEditor from './text-editor';

registerPlugin( 'custom-html-block-extension-text-editor', { render: TextEditor } );
