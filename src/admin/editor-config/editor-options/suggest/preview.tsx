/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function SuggestPreview() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Preview', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Suggest', 'custom-html-block-extension' ) );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			suggest: {
				...editorOptions.suggest,
				preview: value,
			},
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
				checked={ editorOptions.suggest.preview }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/suggest/preview_1.gif',
						description: __(
							'The selected suggestion is shown in the editor before it is accepted.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/suggest/preview_2.gif',
						isDefault: true,
						description: __(
							'The selected suggestion is shown only in the suggestion list until it is accepted.',
							'custom-html-block-extension'
						),
					},
				] }
				value={ editorOptions.suggest.preview }
			/>
		</Stack>
	);
}
