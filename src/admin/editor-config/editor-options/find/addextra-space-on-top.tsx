/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function FindAddExtraSpaceOnTop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			find: {
				...editorOptions.find,
				addExtraSpaceOnTop: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Add Extra Space On Top', 'custom-html-block-extension' ) }
			group="find"
			value={ editorOptions.find.addExtraSpaceOnTop }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/find/addextra-space-on-top_1.jpg',
					description: __(
						'While the find widget is open, extra space is added above the first line so the widget does not cover it.',
						'custom-html-block-extension'
					),
				},
				{
					value: false,
					image: 'editor-options/find/addextra-space-on-top_2.jpg',
					description: __(
						'No extra space is added, so the find widget may cover the first lines.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __(
					'Controls whether the Find Widget should add extra lines on top of the editor.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
