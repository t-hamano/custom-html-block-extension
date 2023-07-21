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

export default function FindLoop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			find: {
				...editorOptions.find,
				loop: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Loop', 'custom-html-block-extension' ) }
				checked={ editorOptions.find.loop }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Loop', 'custom-html-block-extension' ) }
				description={ __(
					'Automatically restart the search from the beginning (or end) when no more matches are found.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle={ true }
				image={ 'editor-options/find/loop.gif' }
				value={ editorOptions.find.loop }
			/>
		</div>
	);
}
