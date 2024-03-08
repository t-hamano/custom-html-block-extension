/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { BaseControl, ButtonGroup, Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function MultiCursorModifier() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Multi cursor modifier key', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Alt (Option)', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_1.gif',
			value: 'alt',
		},
		{
			label: __( 'Ctrl (Command)', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_2.gif',
			value: 'ctrlCmd',
			isDefault: true,
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorModifier: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<BaseControl>
				<BaseControl.VisualLabel>{ title }</BaseControl.VisualLabel>
				<ButtonGroup aria-label={ title }>
					{ items.map( ( item, index ) => (
						<Button
							key={ index }
							variant={ editorOptions.multiCursorModifier === item.value ? 'primary' : undefined }
							onClick={ () => onChange( item.value ) }
							size="compact"
						>
							{ item.label }
						</Button>
					) ) }
				</ButtonGroup>
			</BaseControl>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'You can use multiple cursors for faster editing. Sets the key for applying multiple cursors with modifier key + Click.',
					'custom-html-block-extension'
				) }
				image={ 'editor-options/multi-cursor-modifier.gif' }
			/>
		</div>
	);
}
