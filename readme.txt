=== Custom HTML Block Extension ===
Contributors: wildworks
Tags: gutenberg, block, html, highlighting, emmet
Donate link: https://www.paypal.me/thamanoJP
Requires at least: 5.6
Tested up to: 5.8
Stable tag: 2.3.2
Requires PHP: 7.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Extend custom HTML blocks to evolve into an advanced code editor.

== Description ==
Custom HTML Block Extension extends "Custom HTML block" to evolve into an advanced code editor.
There are 50 different color themes to choose from, and you can select the one that best suits your taste.
This plugin features Emmet that expand shortcut input into complete code. This reduces the number of times you have to type and saves keystrokes.
You can change all kinds of settings to create your ideal editor in advanced mode.
And supports the classic editor, the theme/plugin editor, import/export editor settings, and change indentation.

###Note
This plugin will not work on the "Block Template" editor, which is a new feature in WordPress 5.8.

== Installation ==
1. Upload the `custom-html-block-extension` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the \'Plugins\' menu in WordPress.

== Screenshots ==
1. Custom HTML Block Extension
2. Various color themes
3. Faster coding with Emmet
4. High customizability
5. Classic Editor support

== Resources ==

= @monaco-editor/react =
License: MIT License
Source: https://github.com/suren-atoyan/monaco-react

= emmet-monaco-es =
License: MIT License
Source: https://github.com/troy351/emmet-monaco-es

= monaco-themes =
License: MIT License
Source: https://github.com/brijeshb42/monaco-themes

= webfontloader =
License: Apache-2.0 License
Source: https://github.com/typekit/webfontloader

= Web Font (Fira Code) =
License: OFL-1.1 License
Source: https://github.com/tonsky/FiraCode

= Web Font (Source Code Pro) =
License: OFL-1.1 License
Source: https://github.com/adobe-fonts/source-code-pro

= Web Font (Ubuntu Mono) =
License: OFL-1.1 License
Source: https://ubuntu.com/legal/font-licence

= Web Font (Anonymous Pro) =
License: OFL License
Source: https://www.marksimonson.com/fonts/view/anonymous-pro

== Changelog ==

= 2.3.2 =
* Clean: Update npm packages and run a lint check
* Fix: Indent conversion tool style

= 2.3.1 =
* Fix: Wrong CSS for IntelliSense

= 2.3.0 =
* Add: Theme/Plugin Editor support
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
Add: Indent conversion tool
Fix: Add handling of the classic editor when it does not support the content editor
Doc: Update welcome guide, translation file
Fix: The visual editor added in the metabox does not show up in the Classic Editor

= 2.1.2 =
* Fix: Characters are not visible until the conversion is confirmed when typing Japanese

= 2.1.1 =
* Doc: Update tested up to

= 2.1.0 =
* Testes to WordPress 5.8
* Fix: Issue with the correct block icon not being displayed
* Clean: Update npm packages
* Add: Ctrl+S shortcut action to the classic editor
* Fix: Editor mode is not detected correctly the first time the Classic Editor is used

= 2.0.2 =
* Fix: Error that occurs when the visual editor is disabled in the classic editor

= 2.0.1 =
* Fix: Problem about browser console error and incorrectly margin-top of the code editor at classic editor

= 2.0.0 =
* Doc: Update translation file
* Add: Classic Editor support

= 1.2.1 =
* Fix: Problem aoubt the cut/copy shortcut action does not work properly depending on the settings

= 1.2.0 =
* Doc: Update translation file
* Add: Import/Export editor config tool
* Clean: Ajust internal logic

= 1.1.0 =
* Doc: Update translation file
* Doc: About how to add custom fonts
* Add: Filter hook for adding custom fonts

= 1.0.3 =
* Fix: Indent of the sample code in the editor config preview is not consistent with the settings
* Fix: Incorrect HTML syntax in the sample code of the editor config preview
* Clean: Ajust internal logic
* Change: the range of some setting items
* Style: Add space between the horizontal scroll bar and the handle of resizable box

= 1.0.2 =
* Clean: Re-record and compress gif files

= 1.0.1 =
* Clean: remove console.log
* Clean: remove .eslintignore from .distignore

= 1.0.0 =
* Initial release
