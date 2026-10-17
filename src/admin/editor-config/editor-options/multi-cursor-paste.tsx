/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function MultiCursorPaste() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Multi Cursor Paste', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Spread', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_1.gif',
			value: 'spread',
			description: __(
				'Each cursor pastes a single line of the text.',
				'custom-html-block-extension'
			),
			isDefault: true,
		},
		{
			label: __( 'Full', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_2.gif',
			value: 'full',
			description: __( 'Each cursor pastes the full text.', 'custom-html-block-extension' ),
		},
	];

	const onChange = ( value: string | number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorPaste: value as typeof editorOptions.multiCursorPaste,
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
			<ToggleGroupControl
				label={ title }
				value={ editorOptions.multiCursorPaste }
				onChange={ onChange }
				isBlock
			>
				{ items.map( ( item ) => (
					<ToggleGroupControlOption key={ item.value } value={ item.value } label={ item.label } />
				) ) }
			</ToggleGroupControl>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls pasting when the line count of the pasted text matches the cursor count.',
					'custom-html-block-extension'
				) }
				items={ items }
				value={ editorOptions.multiCursorPaste }
			/>
		</Stack>
	);
}
