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

export default function FoldingHighlight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable highlight for folded codes', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			foldingHighlight: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ title }
					checked={ editorOptions.foldingHighlight }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/folding-highlight_1.jpg',
							isDefault: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/folding-highlight_2.jpg',
						},
					] }
					value={ editorOptions.foldingHighlight }
				/>
			</HStack>
		</div>
	);
}
