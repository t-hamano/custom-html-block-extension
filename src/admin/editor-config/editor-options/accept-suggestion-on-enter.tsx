/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function AcceptSuggestionOnEnter() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Accept suggestions on enter key', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	// monaco types this option as 'on' | 'smart' | 'off'. The 'smart' mode is not
	// exposed in the UI yet, so the toggle only maps between 'on' and 'off'.
	const isEnabled = 'on' === editorOptions.acceptSuggestionOnEnter;

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			acceptSuggestionOnEnter: value ? 'on' : 'off',
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
				description={ createInterpolateElement(
					__(
						'Accept suggestions on <code>Enter</code> key in addition to <code>Tab</code> key.',
						'custom-html-block-extension'
					),
					{
						code: <code />,
					}
				) }
				isToggle
				defaultToggle
				value={ isEnabled }
			/>
		</Stack>
	);
}
