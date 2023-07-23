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
import ItemHelp from '../components/item-help';

export default function MultiCursorPaste() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

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

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorPaste: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<BaseControl>
				<BaseControl.VisualLabel>
					{ __(
						'Behaviour when pasting a text with the line count equal to the cursor count',
						'custom-html-block-extension'
					) }
				</BaseControl.VisualLabel>
				<ButtonGroup
					aria-label={ __(
						'Behaviour when pasting a text with the line count equal to the cursor count',
						'custom-html-block-extension'
					) }
				>
					{ items.map( ( item, index ) => (
						<Button
							key={ index }
							variant={ editorOptions.multiCursorPaste === item.value ? 'primary' : undefined }
							onClick={ () => onChange( item.value ) }
						>
							{ item.label }
						</Button>
					) ) }
				</ButtonGroup>
			</BaseControl>
			<ItemHelp
				onChange={ onChange }
				title={ __(
					'Behaviour when pasting a text with the line count equal to the cursor count',
					'custom-html-block-extension'
				) }
				items={ items }
				value={ editorOptions.multiCursorPaste }
			/>
		</div>
	);
}