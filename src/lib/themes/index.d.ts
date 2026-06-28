/**
 * Type declaration for the themes module, whose implementation remains in
 * JavaScript (see index.js) because it dynamically requires the theme JSON
 * files.
 */
declare const themes: { label: string; value: string; data: Record< string, unknown > }[];

export default themes;
