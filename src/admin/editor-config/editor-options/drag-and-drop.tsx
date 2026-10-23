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

export default function DragAndDrop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			dragAndDrop: value,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Drag And Drop', 'custom-html-block-extension' ),
				value: editorOptions.dragAndDrop,
				onChange,
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should allow moving selections via drag and drop.',
						'custom-html-block-extension'
					),
					image: 'editor-options/drag-and-drop.gif',
				},
			} }
		/>
	);
}
