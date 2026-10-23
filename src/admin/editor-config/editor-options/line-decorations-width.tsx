/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { toNumber } from '../../../lib/helper';
import SettingItem from '../components/setting-item';

export default function LineDecorationsWidth() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			lineDecorationsWidth: value ? toNumber( value, 0, 30 ) : 0,
		} );
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Line Decorations Width (px)', 'custom-html-block-extension' ) }
			value={ editorOptions.lineDecorationsWidth }
			onChange={ onChange }
			min={ 0 }
			max={ 30 }
			defaultValue={ 0 }
			help={ {
				description: __(
					'The width reserved for line decorations. Line decorations are placed between line numbers and the editor content.',
					'custom-html-block-extension'
				),
				image: 'editor-options/line-decorations-width.gif',
			} }
		/>
	);
}
