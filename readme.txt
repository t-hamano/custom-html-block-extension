=== Custom HTML Block Extension ===
Contributors: wildworks
Tags: gutenberg, block, html, highlighting, emmet
Donate link: https://www.paypal.me/thamanoJP
Requires at least: 7.1
Tested up to: 7.2
Stable tag: 5.0.0
Requires PHP: 8.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Turn the Custom HTML block into an advanced code editor.

== Description ==
Custom HTML Block Extension turns the Custom HTML block into an advanced code editor powered by Monaco Editor, the code editor behind VS Code.

Choose from 50 color themes to suit your taste. Block delimiters and shortcodes are highlighted, too.

Type short abbreviations, and Emmet expands them into full code snippets. You can also wrap selected code with an abbreviation.

Fine-tune the look and behavior of the editor to make it your own. You can also import your settings from VS Code and export them back.

The same editor is also available in the code editor of the post and site editors, the "Edit as HTML" mode of all blocks, the classic editor, and the theme and plugin file editors.

== Installation ==
1. Upload the `custom-html-block-extension` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

== Screenshots ==
1. Custom HTML Block Extension
2. Syntax highlighting with 50 themes
3. Faster coding with Emmet
4. Customize the editor to your liking, and import your settings from VS Code
5. Works in the code editor, the "Edit as HTML" mode of all blocks, the classic editor, and the theme and plugin file editors

== Resources ==

= monaco-editor =
* License: MIT License
* Source: https://github.com/microsoft/monaco-editor

= emmet-monaco-es =
* License: MIT License
* Source: https://github.com/troy351/emmet-monaco-es

= monaco-themes =
* License: MIT License
* Source: https://github.com/brijeshb42/monaco-themes

= Web Font (Fira Code) =
* License: OFL-1.1 License
* Source: https://github.com/tonsky/FiraCode

= Web Font (Source Code Pro) =
* License: OFL-1.1 License
* Source: https://github.com/adobe-fonts/source-code-pro

= Web Font (Ubuntu Mono) =
* License: OFL-1.1 License
* Source: https://ubuntu.com/legal/font-licence

= Web Font (Anonymous Pro) =
* License: OFL License
* Source: https://www.marksimonson.com/fonts/view/anonymous-pro

== Changelog ==

= 5.0.0 =
* Tested up to WordPress 7.2
* Drop support for WordPress 7.0
* Drop support for PHP 8.0 and 8.1
* Feature: Use the advanced editor in the code editor of the post and site editors
* Feature: Use the advanced editor in the "Edit as HTML" mode of all blocks
* Feature: Highlight block delimiters and shortcodes
* Feature: Add the "Emmet: Wrap with Abbreviation" command
* Feature: Import settings from the VS Code settings.json file, and export them in the same format
* Enhancement: Match the default editor settings to VS Code
* Enhancement: Add 21 new editor settings
* Enhancement: Update the existing settings to follow the latest Monaco Editor
* Enhancement: Validate and autocomplete theme.json and block.json with their schemas in the theme/plugin editor
* Enhancement: Add the Ctrl+S shortcut to update the file in the theme/plugin editor
* Enhancement: Add a language switcher to the editor preview on the settings page
* Enhancement: Improve the overall design and usability of the settings page
* Enhancement: Revise the setting labels, help descriptions, and help images
* Enhancement: Update the welcome guide, and don't open it automatically on the settings page
* Enhancement: Improve typing performance in the Custom HTML block
* Enhancement: Show a confirmation dialog with the changes before applying imported settings
* Enhancement: Validate the editor settings on the server when saving and importing
* Remove: Custom REST API routes for getting, saving, and resetting settings. Settings are now saved through the WordPress settings REST API
* Clean: Update Monaco Editor to 0.57.0
* Clean: Replace webfontloader with the CSS Font Loading API
* Fix: Emmet suggestions are duplicated after switching modes in the classic editor
* Fix: Top lines of the code editor are hidden behind the toolbar in the classic editor
* Fix: Cursor goes back to the top after saving in the classic editor
* Fix: Some strings are not translated in the classic editor and the theme/plugin editor
* Fix: Some editors keep waiting when the editor script fails to load
* Fix: Loading overlay doesn't disappear when resetting or exporting settings fails on the settings page
* Fix: Resetting the line height doesn't restore the default value
* Fix: Scrollbar size settings show the old values after resetting settings
* Fix: Font weight isn't adjusted when changing to a font family that doesn't have it
* Fix: Admin pointer is shown to users who can't access the settings page
* Fix: Admin pointer keeps showing after visiting the settings page

= 4.1.0 =
* Tested up to WordPress 7.1
* Drop support for WordPress 6.9
* Enhancement: Add a per-block setting to choose the initial mode
* Enhancement: Consolidate the help buttons in the settings page header into a dropdown menu
* Enhancement: Show the fullscreen HTML editor button in preview mode
* Enhancement: Refresh the card design on the settings page
* Enhancement: Support the innerContent-based Custom HTML block
* a11y: Improve tab focus mode accessibility in the editor
* a11y: Fix focus loss on the settings page
* Fix: Uploaded file name is not vertically aligned with the upload button on the settings page
* Fix: Some items are missing from the right-click context menu in the classic editor
* Fix: Panels with no matching settings are shown when filtering settings on the settings page

= 4.0.1 =
* Fix: Undo clears all content right after the editor loads
* Fix: Focusing the editor scrolls the page in the classic editor

= 4.0.0 =
* Tested up to WordPress 7.0
* Drop support for WordPress 6.8
* Remove the Change Indentation UI
* Fix: Editor crashes when switching to the code editor in Firefox
* Fix: Cut line shortcut doesn't work

= 3.9.0 =
* Tested up to WordPress 6.9
* Drop support for WordPress 6.6 and 6.7
* Drop support for PHP 7
* Enhancement: Show a notification after exporting on the settings page
* Enhancement: Adjust UI elements to the new 40px size

= 3.8.0 =
* Tested up to WordPress 6.8
* Drop support for WordPress 6.5
* Enhancement: Use the WordPress snackbar on the settings page
* Fix: No alert is shown when leaving the theme/plugin editor
* Fix: Saving with Ajax doesn't work in the theme/plugin editor
* Fix: Incorrect size of the "Save Options" button on the settings page

= 3.7.0 =
* Tested up to WordPress 6.7
* Drop support for WordPress 6.4
* Enhancement: Polish styles and layouts
* Fix: Minimap and toolbar overlap in the classic editor

= 3.6.0 =
* Tested up to WordPress 6.6
* Drop support for WordPress 6.3
* Fix: Editor is duplicated in the classic editor
* Fix: Critical error when clicking a tab on the settings page
* Fix: Ctrl+S shortcut doesn't work in the classic editor
* Fix: Editor top margin is misaligned in the classic editor
* Fix: Browser console error in the classic editor
* Fix: Browser console error in the theme/plugin editor

= 3.5.0 =
* Tested up to WordPress 6.5
* Drop support for WordPress 6.2
* Enhancement: Polish the settings page and controls
* a11y: Make disabled buttons focusable
* Fix: React warning in the Change Indentation popover

= 3.4.0 =
* Tested up to WordPress 6.4
* Fix: Add Media doesn't work correctly in the classic editor
* Drop support for WordPress 6.1

= 3.3.2 =
* Fix: Browser warning in WordPress 6.3
* Fix: User role settings are not applied to all editors

= 3.3.1 =
* Fix: Some typos

= 3.3.0 =
* Tested up to WordPress 6.3
* Enhancement: Add a filter for settings
* Enhancement: Add a monospace font
* Enhancement: Add a user role permission setting
* Enhancement: Remove the editor refresh button on the settings page
* Enhancement: Apply the theme color to the classic editor
* Enhancement: Use code tags in help modal descriptions
* i18n: Apply stricter capitalization rules and grammar to strings
* a11y: Improve screen reader support
* Fix: Full screen editor doesn't show in the block editor
* Clean: Polish the Change Indentation popover style
* Drop support for WordPress 5.9 and 6.0
* Drop support for PHP 7.3

= 3.2.1 =
* Enhancement: Change the modal HTML editor icon

= 3.2.0 =
* Tested up to WordPress 6.2
* Feature: Add a modal HTML editor
* Enhancement: Don't display toolbar buttons in preview mode
* Fix: Wrong CSS for Monaco Editor in the block editor
* Fix: Copying and cutting lines don't work in the block editor
* Clean: Polish the block editor popover UI
* Clean: Polish the classic editor popover UI
* Clean: Polish the settings page UI

= 3.1.0 =
* Tested up to WordPress 6.1
* Drop support for WordPress 5.6 through 5.8
* Clean: Bump monaco-editor version
* Enhancement: Apply the admin color scheme to the settings screen
* Fix: Position of notifications on the settings screen

= 3.0.3 =
* Bundle the core files of Monaco Editor

= 3.0.2 =
* Tested up to WordPress 6.0
* Update author name

= 3.0.1 =
* Doc: Fix typo

= 3.0.0 =
* Update: Support the full site editor, mobile/tablet device preview, and the block template editor

= 2.5.0 =
* Tested up to WordPress 5.9
* Update: Improve the UI of the indent conversion tool in the block editor
* Update: Disable the code editor in the full site editor, mobile/tablet device preview, and the block template editor
* Remove: Support for local translation files

= 2.4.3 =
* Fix: Wrong CSS for IntelliSense

= 2.4.2 =
* Fix: Incorrect search box style

= 2.4.1 =
* Clean: Remove an unnecessary file included in the release

= 2.4.0 =
* Fix: Editor mode is not detected correctly under certain conditions
* Clean: Update Monaco Editor version
* Clean: Change PHP namespace

= 2.3.3 =
* Fix: Editor mode is not detected correctly under certain conditions

= 2.3.2 =
* Clean: Update npm packages and run a lint check
* Fix: Indent conversion tool style

= 2.3.1 =
* Fix: Wrong CSS for IntelliSense

= 2.3.0 =
* Add: Theme/plugin editor support
* Code refactoring
* Clean: Update npm packages

= 2.2.3 =
* Fix: Quick tag insertion is not reflected in the classic editor

= 2.2.2 =
* Fix: Emmet does not work in the classic editor

= 2.2.1 =
* Clean: Update npm packages
* Remove: Bundled language files

= 2.2.0 =
* Add: Indent conversion tool
* Fix: Handle post types that don't support the content editor in the classic editor
* Doc: Update the welcome guide and translation file
* Fix: The visual editor added in a meta box does not show up in the classic editor

= 2.1.2 =
* Fix: Characters are not visible until the conversion is confirmed when typing Japanese

= 2.1.1 =
* Doc: Update "Tested up to"

= 2.1.0 =
* Tested up to WordPress 5.8
* Fix: The correct block icon is not displayed
* Clean: Update npm packages
* Add: Ctrl+S shortcut action to the classic editor
* Fix: Editor mode is not detected correctly the first time the classic editor is used

= 2.0.2 =
* Fix: Error when the visual editor is disabled in the classic editor

= 2.0.1 =
* Fix: Browser console error and incorrect top margin of the code editor in the classic editor

= 2.0.0 =
* Doc: Update translation file
* Add: Classic editor support

= 1.2.1 =
* Fix: Cut/copy shortcuts don't work properly depending on the settings

= 1.2.0 =
* Doc: Update translation file
* Add: Import/export editor config tool
* Clean: Adjust internal logic

= 1.1.0 =
* Doc: Update translation file
* Doc: Explain how to add custom fonts
* Add: Filter hook for adding custom fonts

= 1.0.3 =
* Fix: Indent of the sample code in the editor config preview is not consistent with the settings
* Fix: Incorrect HTML syntax in the sample code of the editor config preview
* Clean: Adjust internal logic
* Change: Range of some settings
* Style: Add space between the horizontal scrollbar and the resize handle

= 1.0.2 =
* Clean: Re-record and compress GIF files

= 1.0.1 =
* Clean: Remove console.log
* Clean: Remove .eslintignore from .distignore

= 1.0.0 =
* Initial release
