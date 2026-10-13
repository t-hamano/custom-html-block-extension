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

export default function StickyScrollEnabled() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Sticky scroll', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			stickyScroll: {
				...editorOptions.stickyScroll,
				enabled: value,
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
				checked={ editorOptions.stickyScroll.enabled }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'While scrolling, the start lines of the scopes containing the top of the editor, such as parent tags, stay at the top of the editor. Click a pinned line to jump to it.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle
				image="editor-options/sticky-scroll/enabled.gif"
				value={ editorOptions.stickyScroll.enabled }
			/>
		</Stack>
	);
}
