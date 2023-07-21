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

export default function LineDecorationsWidth() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			lineDecorationsWidth: value ? toNumber( value, 0, 30 ) : 0,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Folding area width (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.lineDecorationsWidth }
				min="0"
				max="30"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Folding area width (px)', 'custom-html-block-extension' ) }
				image={ 'editor-options/line-decorations-width.gif' }
				value={ editorOptions.lineDecorationsWidth }
			/>
		</div>
	);
}
