/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function HoverSticky() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Keep Hover Visible on Mouse Over', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Hover', 'custom-html-block-extension' ) );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			hover: {
				...editorOptions.hover,
				sticky: value,
			},
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
				checked={ editorOptions.hover.sticky }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether the hover should remain visible when mouse is moved over it.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle
				image="editor-options/hover/sticky.gif"
				value={ editorOptions.hover.sticky }
			/>
		</Stack>
	);
}
