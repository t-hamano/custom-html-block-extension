/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';
import { toNumber } from '../../../lib/helper';

export default function Rulers() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Vertical line position', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			rulers: 0 < value ? [ toNumber( value, 1, 80 ) ] : [],
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ title }
				value={ editorOptions.rulers.length ? editorOptions.rulers[ 0 ] : 0 }
				min="0"
				max="80"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp onChange={ onChange } title={ title } image={ 'editor-options/rulers.gif' } />
		</div>
	);
}
