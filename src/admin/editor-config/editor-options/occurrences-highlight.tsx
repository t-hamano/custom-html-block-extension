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

export default function OccurrencesHighlight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Occurrences Highlight', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	// monaco types this option as 'off' | 'singleFile' | 'multiFile'. 'multiFile'
	// highlights across every editor on the page, which is of little use for
	// separate Custom HTML blocks, so the toggle only maps between 'singleFile' and
	// 'off'.
	const isEnabled = 'singleFile' === editorOptions.occurrencesHighlight;

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			occurrencesHighlight: value ? 'singleFile' : 'off',
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
			<SwitchControl label={ title } checked={ isEnabled } onCheckedChange={ onChange } />
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether the editor should highlight semantic symbol occurrences.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/occurrences-highlight_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/occurrences-highlight_2.jpg',
					},
				] }
				value={ isEnabled }
			/>
		</Stack>
	);
}
