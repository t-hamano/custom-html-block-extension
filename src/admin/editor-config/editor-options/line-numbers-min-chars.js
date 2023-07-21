/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';
import { toNumber } from 'lib/helper';

export default function LineNumbersMinChars() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			lineNumbersMinChars: value ? toNumber( value, 1, 10 ) : 5,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Line number width', 'custom-html-block-extension' ) }
				value={ editorOptions.lineNumbersMinChars }
				min="1"
				max="10"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				title={ __( 'Line number width', 'custom-html-block-extension' ) }
				image={ 'editor-options/line-numbers-min-chars.gif' }
			/>
		</div>
	);
}
