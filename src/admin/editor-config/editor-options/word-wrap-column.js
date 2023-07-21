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

export default function WordWrapColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			wordWrapColumn: value ? toNumber( value, 20, 200 ) : 80,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Word wrap column', 'custom-html-block-extension' ) }
				value={ editorOptions.wordWrapColumn }
				min="20"
				max="200"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Word wrap column', 'custom-html-block-extension' ) }
				image={ 'editor-options/word-wrap-column.gif' }
				value={ editorOptions.wordWrapColumn }
			/>
		</div>
	);
}
