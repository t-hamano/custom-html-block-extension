/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function LineNumbers() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'lineNumbers' ] ) => {
		setEditorOptions( {
			...editorOptions,
			lineNumbers: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			name="lineNumbers"
			label={ __( 'Line Numbers', 'custom-html-block-extension' ) }
			value={ editorOptions.lineNumbers }
			onChange={ onChange }
			defaultValue="on"
			options={ [
				{
					label: __( 'Hide', 'custom-html-block-extension' ),
					value: 'off',
					image: 'editor-options/line-numbers_1.jpg',
				},
				{
					label: __( 'Show', 'custom-html-block-extension' ),
					value: 'on',
					image: 'editor-options/line-numbers_2.jpg',
				},
				{
					label: __( 'Show number of lines to cursor position', 'custom-html-block-extension' ),
					value: 'relative',
					image: 'editor-options/line-numbers_3.gif',
				},
				{
					label: __( 'Show every 10 lines', 'custom-html-block-extension' ),
					value: 'interval',
					image: 'editor-options/line-numbers_4.gif',
				},
			] }
			help={ {
				description: __( 'Controls the display of line numbers.', 'custom-html-block-extension' ),
				colCount: 4,
			} }
		/>
	);
}
