/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { editorOption } from '../helpers';
import type { SettingPanel } from '../types';

export default function getOtherPanel(): SettingPanel {
	return {
		title: __( 'Other', 'custom-html-block-extension' ),
		settings: [
			{
				id: 'useTabStops',
				control: 'toggle',
				label: __( 'Use Tab Stops', 'custom-html-block-extension' ),
				...editorOption( 'useTabStops' ),
				defaultValue: true,
				help: {
					description: __(
						'Spaces and tabs are inserted and deleted in alignment with tab stops.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/use-tab-stops_1.gif',
							description: __(
								'Indenting with Tab aligns to the next tab stop, and Backspace within the indentation deletes back to the previous tab stop.',
								'custom-html-block-extension'
							),
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/use-tab-stops_2.gif',
							description: __(
								'Indenting with Tab always adds a full Tab Size of indentation, and Backspace deletes one character at a time.',
								'custom-html-block-extension'
							),
							value: false,
						},
					],
				},
			},
			{
				id: 'comments.insertSpace',
				control: 'toggle',
				label: __( 'Comments: Insert Space', 'custom-html-block-extension' ),
				group: __( 'Comments', 'custom-html-block-extension' ),
				...editorOption( 'comments', 'insertSpace' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether a space character is inserted when commenting.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/comments_insert-space_1.jpg',
							description: __(
								'A space is inserted between the comment characters and the text, such as <!-- text -->.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/comments_insert-space_2.jpg',
							description: __(
								'No space is inserted between the comment characters and the text, such as <!--text-->.',
								'custom-html-block-extension'
							),
						},
					],
				},
			},
			{
				id: 'links',
				control: 'toggle',
				label: __( 'Clickable Links', 'custom-html-block-extension' ),
				...editorOption( 'links' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should detect links and make them clickable.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/links_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/links_2.jpg',
							value: false,
						},
					],
				},
			},
		],
	};
}
