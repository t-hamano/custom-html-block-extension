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

export default function UseTabStops() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Use Tab Stops', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			useTabStops: value,
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
				checked={ editorOptions.useTabStops }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Spaces and tabs are inserted and deleted in alignment with tab stops.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						image: 'editor-options/use-tab-stops_1.gif',
						description: __(
							'Indenting with Tab aligns to the next tab stop, and Backspace within the indentation deletes back to the previous tab stop.',
							'custom-html-block-extension'
						),
						value: true,
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						image: 'editor-options/use-tab-stops_2.gif',
						description: __(
							'Indenting with Tab always adds a full Tab Size of indentation, and Backspace deletes one character at a time.',
							'custom-html-block-extension'
						),
						value: false,
					},
				] }
				value={ editorOptions.useTabStops }
			/>
		</Stack>
	);
}
