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

export default function StickyTabStops() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Sticky Tab Stops', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			stickyTabStops: value,
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
				checked={ editorOptions.stickyTabStops }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/sticky-tab-stops_1.gif',
						description: __(
							'When using spaces for indentation, the cursor and selection stick to tab stops, emulating tab characters.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/sticky-tab-stops_2.gif',
						description: __(
							'The cursor moves one space at a time within indentation made of spaces.',
							'custom-html-block-extension'
						),
						isDefault: true,
					},
				] }
				value={ editorOptions.stickyTabStops }
			/>
		</Stack>
	);
}
