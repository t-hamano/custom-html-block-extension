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

export default function LineNumbersMinChars() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Line number width', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			lineNumbersMinChars: value ? toNumber( value, 1, 10 ) : 5,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ title }
				value={ editorOptions.lineNumbersMinChars }
				min="1"
				max="10"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp title={ title } image={ 'editor-options/line-numbers-min-chars.gif' } />
		</div>
	);
}
