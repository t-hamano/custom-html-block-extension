/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function WordWrap() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Word wrap', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Off', 'custom-html-block-extension' ),
			value: 'off',
			image: 'editor-options/word-wrap_1.jpg',
			description: __( 'The lines will never wrap.', 'custom-html-block-extension' ),
			isDefault: true,
		},
		{
			label: __( 'On', 'custom-html-block-extension' ),
			value: 'on',
			image: 'editor-options/word-wrap_2.jpg',
			description: __( 'The lines will always wrap.', 'custom-html-block-extension' ),
		},
		{
			label: __( 'Depends on word wrap column', 'custom-html-block-extension' ),
			value: 'wordWrapColumn',
			image: 'editor-options/word-wrap_3.jpg',
			description: __(
				'The lines will be wrapped according to "Word wrap column" setting.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Flexible', 'custom-html-block-extension' ),
			value: 'bounded',
			image: 'editor-options/word-wrap_4.jpg',
			description: __(
				"The lines will be wrapped at the lesser of editor's width or word wrap column setting.",
				'custom-html-block-extension'
			),
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			wordWrap: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ title }
				value={ editorOptions.wordWrap }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.wordWrap }
			/>
		</div>
	);
}
