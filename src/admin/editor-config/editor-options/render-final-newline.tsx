/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function RenderFinalNewline() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __(
		'Render last line number when the file ends with a newline',
		'custom-html-block-extension'
	);
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			renderFinalNewline: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ title }
					checked={ editorOptions.renderFinalNewline }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/render-final-newline_1.jpg',
							isDefault: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/render-final-newline_2.jpg',
						},
					] }
					value={ editorOptions.renderFinalNewline }
				/>
			</HStack>
		</div>
	);
}
