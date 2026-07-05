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

export default function CursorSmoothCaretAnimation() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable smooth cursor animation', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	// monaco types this option as 'off' | 'explicit' | 'on'. The 'explicit' mode is
	// not exposed in the UI yet, so the toggle only maps between 'on' and 'off'.
	const isEnabled = 'on' === editorOptions.cursorSmoothCaretAnimation;

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSmoothCaretAnimation: value ? 'on' : 'off',
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
			<ToggleControl label={ title } checked={ isEnabled } onChange={ onChange } />
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/cursor-smooth-caret-animation_1.gif',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/cursor-smooth-caret-animation_2.gif',
						isDefault: true,
					},
				] }
				value={ isEnabled }
			/>
		</Stack>
	);
}
