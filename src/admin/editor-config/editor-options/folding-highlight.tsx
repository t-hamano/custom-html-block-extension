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

export default function FoldingHighlight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			foldingHighlight: value,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Folding Highlight', 'custom-html-block-extension' ),
				value: editorOptions.foldingHighlight,
				onChange,
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should highlight folded ranges.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/folding-highlight_1.jpg',
							description: __(
								'Folded lines are shown with a background highlight.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/folding-highlight_2.jpg',
							description: __(
								'Folded lines are shown without a background highlight.',
								'custom-html-block-extension'
							),
						},
					],
				},
			} }
		/>
	);
}
