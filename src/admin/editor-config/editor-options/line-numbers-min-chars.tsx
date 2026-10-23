/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function LineNumbersMinChars() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Line Numbers Min Chars', 'custom-html-block-extension' ),
				...editorOption( 'lineNumbersMinChars' ),
				min: 1,
				max: 10,
				defaultValue: 5,
				help: {
					description: __(
						'Controls the width of line numbers, by reserving horizontal space for rendering at least an amount of digits.',
						'custom-html-block-extension'
					),
					image: 'editor-options/line-numbers-min-chars.gif',
				},
			} }
		/>
	);
}
