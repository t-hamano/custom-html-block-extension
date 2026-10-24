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

export default function StickyScrollEnabled() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			stickyScroll: {
				...editorOptions.stickyScroll,
				enabled: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Sticky Scroll', 'custom-html-block-extension' ) }
			value={ editorOptions.stickyScroll.enabled }
			onChange={ onChange }
			defaultValue
			help={ {
				description: __(
					'Shows the nested current scopes during the scroll at the top of the editor.',
					'custom-html-block-extension'
				),
				image: 'editor-options/sticky-scroll/enabled.gif',
			} }
		/>
	);
}
