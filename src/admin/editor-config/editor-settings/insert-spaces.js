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

export default function InsertSpaces() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Indent type', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

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
				<BaseControl.VisualLabel>{ title }</BaseControl.VisualLabel>
				<ButtonGroup aria-label={ __( 'Indent type', 'custom-html-block-extension' ) }>
					{ items.map( ( item, index ) => (
						<Button
							key={ index }
							variant={ editorSettings.insertSpaces === item.value ? 'primary' : undefined }
							onClick={ () => onChange( item.value ) }
							size="compact"
						>
							{ item.label }
						</Button>
					) ) }
				</ButtonGroup>
			</BaseControl>
		</div>
	);
}
