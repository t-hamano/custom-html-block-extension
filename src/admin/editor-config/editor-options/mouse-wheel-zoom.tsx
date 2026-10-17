/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function MouseWheelZoom() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Mouse Wheel Zoom', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			mouseWheelZoom: value,
		} );
	};

	return (
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SwitchControl
				label={ title }
				checked={ editorOptions.mouseWheelZoom }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={
					isAppleOS()
						? __(
								'Zoom the font of the editor when using mouse wheel and holding Cmd.',
								'custom-html-block-extension'
							)
						: __(
								'Zoom the font of the editor when using mouse wheel and holding Ctrl.',
								'custom-html-block-extension'
							)
				}
				isToggle
				defaultToggle={ false }
				image="editor-options/mouse-wheel-zoom.gif"
				value={ editorOptions.mouseWheelZoom }
			/>
		</Stack>
	);
}
