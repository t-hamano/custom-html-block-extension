/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import {
	__experimentalHStack as HStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function MultiCursorPaste() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __(
		'Behavior when pasting text with matching line and cursor counts',
		'custom-html-block-extension'
	);
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Spread', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_1.gif',
			value: 'spread',
		},
		{
			label: __( 'Full', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_2.gif',
			value: 'full',
			isDefault: true,
		},
	];

	const onChange = ( value: string | number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorPaste: value as typeof editorOptions.multiCursorPaste,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleGroupControl
					size="__unstable-large"
					label={ title }
					value={ editorOptions.multiCursorPaste }
					onChange={ onChange }
					isBlock
				>
					{ items.map( ( item ) => (
						<ToggleGroupControlOption
							key={ item.value }
							value={ item.value }
							label={ item.label }
						/>
					) ) }
				</ToggleGroupControl>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					value={ editorOptions.multiCursorPaste }
				/>
			</HStack>
		</div>
	);
}
