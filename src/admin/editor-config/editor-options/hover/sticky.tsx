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

	const title = __(
		'Keep hover hints open while hovering over them',
		'custom-html-block-extension'
	);
	const isVisible = useSearchVisibility( title );

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
					'Hover hints stay open when the mouse moves onto them, so you can select their text or click their links.',
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
