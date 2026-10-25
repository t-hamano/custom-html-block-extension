/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function AcceptSuggestionOnEnter() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'acceptSuggestionOnEnter' ] ) => {
		setEditorOptions( {
			...editorOptions,
			acceptSuggestionOnEnter: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			name="acceptSuggestionOnEnter"
			label={ __( 'Accept Suggestion On Enter', 'custom-html-block-extension' ) }
			value={ editorOptions.acceptSuggestionOnEnter }
			onChange={ onChange }
			defaultValue="on"
			options={ [
				{
					label: __( 'Enable', 'custom-html-block-extension' ),
					value: 'on',
					image: 'editor-options/accept-suggestion-on-enter_1.gif',
					description: createInterpolateElement(
						__(
							'Pressing <code>Enter</code> accepts the suggestion, even if it is the same as the word already typed.',
							'custom-html-block-extension'
						),
						{
							code: <code />,
						}
					),
				},
				{
					label: __( 'Only when it makes a text change', 'custom-html-block-extension' ),
					value: 'smart',
					image: 'editor-options/accept-suggestion-on-enter_2.gif',
					description: createInterpolateElement(
						__(
							'Only accept a suggestion with <code>Enter</code> when it makes a textual change.',
							'custom-html-block-extension'
						),
						{
							code: <code />,
						}
					),
				},
				{
					label: __( 'Disable', 'custom-html-block-extension' ),
					value: 'off',
					image: 'editor-options/accept-suggestion-on-enter_3.gif',
					description: createInterpolateElement(
						__(
							'Pressing <code>Enter</code> always inserts a new line. Use <code>Tab</code> to accept the suggestion.',
							'custom-html-block-extension'
						),
						{
							code: <code />,
						}
					),
				},
			] }
			help={ {
				description: createInterpolateElement(
					__(
						'Accept suggestions on <code>Enter</code> key in addition to <code>Tab</code> key.',
						'custom-html-block-extension'
					),
					{
						code: <code />,
					}
				),
				colCount: 3,
			} }
		/>
	);
}
