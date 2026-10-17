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
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function ScrollbarAlwaysConsumeMouseWheel() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Always Consume Mouse Wheel', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Scrollbar', 'custom-html-block-extension' ) );

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
			<SwitchControl
				label={ title }
				checked={ editorOptions.scrollbar.alwaysConsumeMouseWheel }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether the editor keeps mouse wheel scrolling to itself, instead of passing it on to the page.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						isDefault: true,
						description: __(
							'The page does not scroll, even when the editor is scrolled to the top or bottom.',
							'custom-html-block-extension'
						),
						image: 'editor-options/scrollbar/always-consume-mouse-wheel_1.gif',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						description: __(
							'The page scrolls when the editor is scrolled to the top or bottom.',
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
