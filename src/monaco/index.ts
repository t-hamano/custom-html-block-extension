/**
 * The monaco editor bundle. Each window that shows an editor loads this script,
 * so that monaco renders into and listens to the window it runs in.
 */

/**
 * Internal dependencies
 */
import './environment';

/**
 * External dependencies
 */
import * as monaco from 'monaco-editor';

window.monaco = monaco;
