/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { Text } from '@wordpress/ui';

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
			label={ __( 'Accept Suggestion On Enter', 'custom-html-block-extension' ) }
			value={ editorOptions.acceptSuggestionOnEnter }
			onChange={ onChange }
			defaultValue="on"
			options={ [
				{
					label: __( 'Enable', 'custom-html-block-extension' ),
					value: 'on',
					image: 'editor-options/accept-suggestion-on-enter_1.gif',
					description: __(
						'Pressing Enter accepts the suggestion, even if it is the same as the word already typed.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Only when it makes a text change', 'custom-html-block-extension' ),
					value: 'smart',
					image: 'editor-options/accept-suggestion-on-enter_2.gif',
					description: __(
						'Only accept a suggestion with Enter when it makes a textual change.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Disable', 'custom-html-block-extension' ),
					value: 'off',
					image: 'editor-options/accept-suggestion-on-enter_3.gif',
					description: __(
						'Pressing Enter always inserts a new line. Use Tab to accept the suggestion.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: (
					<Text render={ <p /> }>
						{ createInterpolateElement(
							__(
								'Accept suggestions on <code>Enter</code> key in addition to <code>Tab</code> key.',
								'custom-html-block-extension'
							),
							{
								code: <code />,
							}
						) }
					</Text>
				),
				showOptions: true,
				colCount: 3,
			} }
		/>
	);
}
