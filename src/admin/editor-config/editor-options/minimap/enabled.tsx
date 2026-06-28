/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function MinimapEnabled() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable minimap', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				enabled: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ title }
					checked={ editorOptions.minimap.enabled }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					description={ __(
						'Minimap gives you a high-level overview of your source code, which is useful for quick navigation and code understanding. You can click or drag the shaded area to quickly jump to different sections.',
						'custom-html-block-extension'
					) }
					isToggle
					defaultToggle
					image="editor-options/minimap/enabled.gif"
					value={ editorOptions.minimap.enabled }
				/>
			</HStack>
		</div>
	);
}
