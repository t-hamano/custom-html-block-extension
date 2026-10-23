/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { toNumber } from '../../../../lib/helper';
import SettingItem from '../../components/setting-item';

export default function StickyScrollMaxLineCount() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			stickyScroll: {
				...editorOptions.stickyScroll,
				maxLineCount: value ? toNumber( value, 1, 20 ) : 5,
			},
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Max Line Count', 'custom-html-block-extension' ),
				group: __( 'Sticky Scroll', 'custom-html-block-extension' ),
				value: editorOptions.stickyScroll.maxLineCount,
				onChange,
				min: 1,
				max: 20,
				defaultValue: 5,
				help: {
					description: __(
						'Defines the maximum number of sticky lines to show.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'2'
							),
							image: 'editor-options/sticky-scroll/max-line-count_1.gif',
							value: 2,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'5'
							),
							image: 'editor-options/sticky-scroll/max-line-count_2.gif',
							value: 5,
						},
					],
				},
			} }
		/>
	);
}
