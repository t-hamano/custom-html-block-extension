/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function EmptySelectionClipboard() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Empty Selection Clipboard', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			emptySelectionClipboard: value,
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
				checked={ editorOptions.emptySelectionClipboard }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether copying without a selection copies the current line.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle
				image="editor-options/empty-selection-clipboard.gif"
				value={ editorOptions.emptySelectionClipboard }
			/>
		</Stack>
	);
}
