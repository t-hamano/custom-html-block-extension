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

export default function FindLoop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			find: {
				...editorOptions.find,
				loop: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Loop', 'custom-html-block-extension' ) }
			group="find"
			value={ editorOptions.find.loop }
			onChange={ onChange }
			defaultValue
			help={ {
				description: __(
					'Controls whether the search automatically restarts from the beginning (or the end) when no further matches can be found.',
					'custom-html-block-extension'
				),
				image: 'editor-options/find/loop.gif',
			} }
		/>
	);
}
