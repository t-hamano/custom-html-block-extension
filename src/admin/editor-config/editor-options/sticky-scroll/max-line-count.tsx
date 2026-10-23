/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function StickyScrollMaxLineCount() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Max Line Count', 'custom-html-block-extension' ),
				group: __( 'Sticky Scroll', 'custom-html-block-extension' ),
				...editorOption( 'stickyScroll', 'maxLineCount' ),
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
