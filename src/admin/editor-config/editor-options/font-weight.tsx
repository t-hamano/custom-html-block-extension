/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function FontWeight() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Font Weight', 'custom-html-block-extension' ),
				...editorOption( 'fontWeight' ),
				options: ( { fontWeights } ) =>
					fontWeights.map( ( fontWeight ) => ( {
						label: String( fontWeight ),
						value: String( fontWeight ),
					} ) ),
			} ) }
		/>
	);
}
