/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import ItemHelp from '../../components/item-help';

export default function FindLoop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Loop', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

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
			<ToggleControl label={ title } checked={ editorOptions.find.loop } onChange={ onChange } />
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Automatically restart the search from the beginning (or end) when no more matches are found.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle
				image={ 'editor-options/find/loop.gif' }
				value={ editorOptions.find.loop }
			/>
		</div>
	);
}
