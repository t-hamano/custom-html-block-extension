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

export default function Folding() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			folding: value,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Folding', 'custom-html-block-extension' ),
				value: editorOptions.folding,
				onChange,
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor has code folding enabled.',
						'custom-html-block-extension'
					),
					image: 'editor-options/folding.gif',
				},
			} }
		/>
	);
}
