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

export default function OverviewRulerBorder() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Show border on scrollbar', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			overviewRulerBorder: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" align="start" wrap>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ title }
					checked={ editorOptions.overviewRulerBorder }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/overview-ruler-border_1.jpg',
							value: true,
							isDefault: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/overview-ruler-border_2.jpg',
							value: false,
						},
					] }
					value={ editorOptions.overviewRulerBorder }
				/>
			</HStack>
		</div>
	);
}
