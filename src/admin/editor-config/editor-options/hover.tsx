/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function Hover() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Hover hints', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Enable', 'custom-html-block-extension' ),
			value: 'on',
			isDefault: true,
		},
		{
			label: __( 'Enable only while holding a modifier key', 'custom-html-block-extension' ),
			value: 'onKeyboardModifier',
		},
		{
			label: __( 'Disable', 'custom-html-block-extension' ),
			value: 'off',
		},
	];

	const onChange = ( value: EditorOptions[ 'hover' ][ 'enabled' ] ) => {
		setEditorOptions( {
			...editorOptions,
			hover: {
				...editorOptions.hover,
				enabled: value,
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
			<SelectControl
				label={ title }
				items={ items }
				value={ items.find( ( item ) => item.value === editorOptions.hover.enabled ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'hover' ][ 'enabled' ] )
				}
			/>
			<ItemHelp
				title={ title }
				description={
					<>
						<Text render={ <p /> }>
							{ __(
								'Shows hints when the mouse is over an element or attribute.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							{ __(
								'If "Enable only while holding a modifier key" is selected, hints are shown only while holding the modifier key that is not used for "Multi cursor modifier key".',
								'custom-html-block-extension'
							) }
						</Text>
					</>
				}
				image="editor-options/hover.gif"
			/>
		</Stack>
	);
}
