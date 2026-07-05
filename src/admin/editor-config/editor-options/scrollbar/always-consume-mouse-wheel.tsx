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
import { AdminContext } from '../../../index';
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function ScrollbarAlwaysConsumeMouseWheel() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Stop browser scroll', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				alwaysConsumeMouseWheel: value,
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
			<ToggleControl
				label={ title }
				checked={ editorOptions.scrollbar.alwaysConsumeMouseWheel }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						isDefault: true,
						description: __(
							'Browser does not scroll when mouse wheel reaches the beginning or end.',
							'custom-html-block-extension'
						),
						image: 'editor-options/scrollbar/always-consume-mouse-wheel_1.gif',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						description: __(
							'Browser will scroll when mouse wheel reaches the beginning or end.',
							'custom-html-block-extension'
						),
						image: 'editor-options/scrollbar/always-consume-mouse-wheel_2.gif',
					},
				] }
				value={ editorOptions.scrollbar.alwaysConsumeMouseWheel }
			/>
		</Stack>
	);
}
