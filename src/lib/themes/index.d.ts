/**
 * Type declaration for the themes module, whose implementation remains in
 * JavaScript (see index.js) because it dynamically requires the theme JSON
 * files.
 */
/**
 * Internal dependencies
 */
import type { Theme } from '../../types';

declare const themes: Theme[];

export default themes;
