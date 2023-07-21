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

export default function PaddingBottom() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			padding: {
				...editorOptions.padding,
				bottom: value ? toNumber( value, 0, 50 ) : 0,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Padding bottom (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.padding.bottom }
				min="0"
				max="50"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Padding bottom (px)', 'custom-html-block-extension' ) }
				description={ __(
					'Spacing between bottom edge of editor and last line. This setting will not work if "Scroll past the last line" is enabled in "Mouse and Scroll" category.',
					'custom-html-block-extension'
				) }
				image={ 'editor-options/padding/bottom.gif' }
			/>
		</div>
	);
}
