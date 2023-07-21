/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function AcceptSuggestionOnEnter() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			acceptSuggestionOnEnter: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Accept suggestions on enter key', 'custom-html-block-extension' ) }
				checked={ editorOptions.acceptSuggestionOnEnter }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Accept suggestions on enter key', 'custom-html-block-extension' ) }
				description={ __(
					'Accept suggestions on enter key in addition to tab key.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle={ true }
				value={ editorOptions.acceptSuggestionOnEnter }
			/>
		</div>
	);
}
