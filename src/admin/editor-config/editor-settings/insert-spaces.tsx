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

export default function InsertSpaces() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const title = __( 'Indent type', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Tab', 'custom-html-block-extension' ),
			image: 'editor-settings/insert-spaces_1.jpg',
			value: 'tab',
		},
		{
			label: __( 'Space', 'custom-html-block-extension' ),
			image: 'editor-settings/insert-spaces_2.jpg',
			value: 'space',
			isDefault: true,
		},
	];

	const onChange = ( value: string | number | undefined ) => {
		setEditorSettings( {
			...editorSettings,
			insertSpaces: value === 'space',
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
				label={ __( 'Indent type', 'custom-html-block-extension' ) }
				value={ editorSettings.insertSpaces ? 'space' : 'tab' }
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
					'Controls whether to insert a tab character or spaces when pressing the Tab key.',
					'custom-html-block-extension'
				) }
				items={ items }
				value={ editorSettings.insertSpaces ? 'space' : 'tab' }
			/>
		</Stack>
	);
}
