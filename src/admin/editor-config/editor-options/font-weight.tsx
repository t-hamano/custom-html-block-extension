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

type FontWeightProps = {
	fontWeights: number[];
};

export default function FontWeight( { fontWeights }: FontWeightProps ) {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			fontWeight: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			name="fontWeight"
			label={ __( 'Font Weight', 'custom-html-block-extension' ) }
			value={ String( editorOptions.fontWeight ) }
			onChange={ onChange }
			options={ fontWeights.map( ( fontWeight ) => ( {
				label: String( fontWeight ),
				value: String( fontWeight ),
			} ) ) }
		/>
	);
}
