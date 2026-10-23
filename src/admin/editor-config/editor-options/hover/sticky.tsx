/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function HoverSticky() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			hover: {
				...editorOptions.hover,
				sticky: value,
			},
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Keep Hover Visible on Mouse Over', 'custom-html-block-extension' ),
				group: __( 'Hover', 'custom-html-block-extension' ),
				value: editorOptions.hover.sticky,
				onChange,
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the hover should remain visible when mouse is moved over it.',
						'custom-html-block-extension'
					),
					image: 'editor-options/hover/sticky.gif',
				},
			} }
		/>
	);
}
