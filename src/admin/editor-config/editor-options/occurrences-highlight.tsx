/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function OccurrencesHighlight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Highlight matching tag', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	// monaco types this option as 'off' | 'singleFile' | 'multiFile'. The 'multiFile'
	// mode is not exposed in the UI yet, so the toggle only maps between 'singleFile'
	// and 'off'.
	const isEnabled = 'singleFile' === editorOptions.occurrencesHighlight;

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			occurrencesHighlight: value ? 'singleFile' : 'off',
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<Stack justify="start" align="start" wrap="wrap" gap="sm">
				<ToggleControl label={ title } checked={ isEnabled } onChange={ onChange } />
				<ItemHelp
					onChange={ onChange }
					title={ title }
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
		</div>
	);
}
