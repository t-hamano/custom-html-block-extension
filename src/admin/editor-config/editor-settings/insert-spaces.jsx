/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

import { PanelRow, BaseControl, ButtonGroup, Button } from '@wordpress/components';

const InsertSpaces = () => {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorSettings( {
			...editorSettings,
			insertSpaces: value,
		} );
	};

	return (
		<PanelRow>
			<BaseControl
				id="custom-html-block-extension/insert-spaces"
				label={ __( 'Indent type', 'custom-html-block-extension' ) }
			>
				<ButtonGroup>
					<Button
						isPrimary={ ! editorSettings.insertSpaces }
						onClick={ () => handleChange( false ) }
					>
						{ __( 'Tab', 'custom-html-block-extension' ) }
					</Button>
					<Button isPrimary={ editorSettings.insertSpaces } onClick={ () => handleChange( true ) }>
						{ __( 'Space', 'custom-html-block-extension' ) }
					</Button>
				</ButtonGroup>
			</BaseControl>
		</PanelRow>
	);
};

export default InsertSpaces;
