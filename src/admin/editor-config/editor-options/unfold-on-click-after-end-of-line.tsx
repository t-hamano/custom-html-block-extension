/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function UnfoldOnClickAfterEndOfLine() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			unfoldOnClickAfterEndOfLine: value,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Unfold On Click After End Of Line', 'custom-html-block-extension' ),
				value: editorOptions.unfoldOnClickAfterEndOfLine,
				onChange,
				defaultValue: false,
				help: {
					description: __(
						'Controls whether clicking on the empty content after a folded line will unfold the line.',
						'custom-html-block-extension'
					),
					image: 'editor-options/unfold-on-click-after-end-of-line.gif',
				},
			} }
		/>
	);
}
