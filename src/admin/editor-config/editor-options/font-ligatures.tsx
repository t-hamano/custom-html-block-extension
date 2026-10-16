/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function FontLigatures() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Font Ligatures', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	// monaco also accepts a string, used as the CSS `font-feature-settings`
	// value (e.g. '"ss01", "ss02"' for stylistic sets). Only Fira Code supports
	// ligatures among the fonts here, so a free-form field is of little use and
	// the toggle only maps between `true` and `false`.
	const items = [
		{
			label: __( 'Enable', 'custom-html-block-extension' ),
			value: true,
			image: 'editor-options/font-ligatures_1.jpg',
		},
		{
			label: __( 'Disable', 'custom-html-block-extension' ),
			value: false,
			image: 'editor-options/font-ligatures_2.jpg',
			isDefault: true,
		},
	];

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			fontLigatures: value,
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
			<SwitchControl
				label={ title }
				checked={ editorOptions.fontLigatures }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					"Enables/Disables font ligatures ('calt' and 'liga' font features). Only Fira Code font supports ligatures.",
					'custom-html-block-extension'
				) }
				items={ items }
				value={ editorOptions.fontLigatures }
			/>
		</Stack>
	);
}
