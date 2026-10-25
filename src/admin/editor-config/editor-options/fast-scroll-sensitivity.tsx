/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { toNumber } from '../../../lib/helper';
import SettingItem from '../components/setting-item';

export default function FastScrollSensitivity() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			fastScrollSensitivity: value ? toNumber( value, 1, 10 ) : 5,
		} );
	};

	return (
		<SettingItem
			control="range"
			name="fastScrollSensitivity"
			label={ __( 'Fast Scroll Sensitivity', 'custom-html-block-extension' ) }
			value={ editorOptions.fastScrollSensitivity }
			onChange={ onChange }
			min={ 1 }
			max={ 10 }
			defaultValue={ 5 }
			options={ [
				{
					image: 'editor-options/fast-scroll-sensitivity_1.gif',
					value: 1,
				},
				{
					image: 'editor-options/fast-scroll-sensitivity_2.gif',
					value: 5,
				},
			] }
			help={ {
				description: isAppleOS()
					? createInterpolateElement(
							__(
								'Scrolling speed multiplier when pressing <code>Option</code>.',
								'custom-html-block-extension'
							),
							{
								code: <code />,
							}
						)
					: createInterpolateElement(
							__(
								'Scrolling speed multiplier when pressing <code>Alt</code>.',
								'custom-html-block-extension'
							),
							{
								code: <code />,
							}
						),
			} }
		/>
	);
}
