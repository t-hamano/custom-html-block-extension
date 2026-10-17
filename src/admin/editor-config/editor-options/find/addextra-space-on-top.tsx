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

export default function FindAddExtraSpaceOnTop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Add Extra Space On Top', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			find: {
				...editorOptions.find,
				addExtraSpaceOnTop: value,
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
				checked={ editorOptions.find.addExtraSpaceOnTop }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/find/addextra-space-on-top_1.jpg',
						description: __(
							'While the find widget is open, extra space is added above the first line so the widget does not cover it.',
							'custom-html-block-extension'
						),
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/find/addextra-space-on-top_2.jpg',
						description: __(
							'No extra space is added, so the find widget may cover the first lines.',
							'custom-html-block-extension'
						),
					},
				] }
				value={ editorOptions.find.addExtraSpaceOnTop }
			/>
		</Stack>
	);
}
