/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { toNumber } from '../../../lib/helper';
import SettingItem from '../components/setting-item';

export default function QuickSuggestionsDelay() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			quickSuggestionsDelay: value ? toNumber( value, 0, 1000 ) : 10,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Quick Suggestions Delay (ms)', 'custom-html-block-extension' ),
				value: editorOptions.quickSuggestionsDelay,
				onChange,
				min: 0,
				max: 1000,
				defaultValue: 10,
				help: {
					description: __(
						'Controls the delay in milliseconds after which quick suggestions will show up.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/quick-suggestions-delay_1.gif',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'1000'
							),
							image: 'editor-options/quick-suggestions-delay_2.gif',
							value: 1000,
						},
					],
				},
			} }
		/>
	);
}
