/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function EmptySelectionClipboard() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			emptySelectionClipboard: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Empty Selection Clipboard', 'custom-html-block-extension' ) }
			value={ editorOptions.emptySelectionClipboard }
			onChange={ onChange }
			defaultValue
			help={ {
				description: __(
					'Controls whether copying without a selection copies the current line.',
					'custom-html-block-extension'
				),
				image: 'editor-options/empty-selection-clipboard.gif',
			} }
		/>
	);
}
