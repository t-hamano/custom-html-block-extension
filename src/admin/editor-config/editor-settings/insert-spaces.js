/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { BaseControl, ButtonGroup, Button } from '@wordpress/components';

export default function InsertSpaces() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const items = [
		{
			label: __( 'Tab', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_1.gif',
			value: false,
		},
		{
			label: __( 'Space', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_2.gif',
			value: true,
		},
	];

	const onChange = ( value ) => {
		setEditorSettings( {
			...editorSettings,
			insertSpaces: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<BaseControl>
				<BaseControl.VisualLabel>
					{ __( 'Indent type', 'custom-html-block-extension' ) }
				</BaseControl.VisualLabel>
				<ButtonGroup>
					{ items.map( ( item, index ) => (
						<Button
							key={ index }
							variant={ editorSettings.insertSpaces === item.value ? 'primary' : undefined }
							onClick={ () => onChange( item.value ) }
						>
							{ item.label }
						</Button>
					) ) }
				</ButtonGroup>
			</BaseControl>
		</div>
	);
}
