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

export default function UnfoldOnClickAfterEndOfLine() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Unfold On Click After End Of Line', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			unfoldOnClickAfterEndOfLine: value,
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
				checked={ editorOptions.unfoldOnClickAfterEndOfLine }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether clicking on the empty content after a folded line will unfold the line.',
					'custom-html-block-extension'
				) }
				isToggle
				image="editor-options/unfold-on-click-after-end-of-line.gif"
				defaultToggle={ false }
				value={ editorOptions.unfoldOnClickAfterEndOfLine }
			/>
		</Stack>
	);
}
