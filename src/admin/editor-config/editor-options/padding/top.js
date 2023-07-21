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

export default function PaddingTop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			padding: {
				...editorOptions.padding,
				top: value ? toNumber( value, 0, 50 ) : 0,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Padding top (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.padding.top }
				min="0"
				max="50"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Padding top (px)', 'custom-html-block-extension' ) }
				description={ __(
					'Spacing between top edge of editor and first line.',
					'custom-html-block-extension'
				) }
				image={ 'editor-options/padding/top.gif' }
			/>
		</div>
	);
}
