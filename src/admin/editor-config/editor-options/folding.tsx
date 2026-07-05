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

export default function Folding() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable code folding', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			folding: value,
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
			<ToggleControl label={ title } checked={ editorOptions.folding } onChange={ onChange } />
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'You can fold regions of source code using the folding icons between line numbers and line start. Move the mouse over the folding icon and click to fold and unfold regions. Use Shift + Click on the folding icon to fold or unfold the region and all regions inside.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle
				image="editor-options/folding.gif"
				value={ editorOptions.folding }
			/>
		</Stack>
	);
}
