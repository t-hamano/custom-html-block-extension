/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Link, Text } from '@wordpress/ui';
import { createInterpolateElement, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function FontFamily() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			fontFamily: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Font Family', 'custom-html-block-extension' ) }
			value={ editorOptions.fontFamily }
			onChange={ onChange }
			options={ [
				...window.chbeObj.fontFamily.map( ( { label, name } ) => ( {
					label: label ?? name,
					value: name,
				} ) ),
				{
					label: __( 'Monospace', 'custom-html-block-extension' ),
					value: 'monospace',
				},
			] }
			help={ {
				hideOptions: true,
				description: (
					<Text render={ <p /> }>
						{ createInterpolateElement(
							__(
								'You can use your own favorite fonts in addition to the default fonts. Please refer to the <a>GitHub project page</a> for instructions on how to add custom fonts.',
								'custom-html-block-extension'
							),
							{
								a: (
									<Link
										href={ __(
											'https://github.com/t-hamano/custom-html-block-extension#add-custom-fonts',
											'custom-html-block-extension'
										) }
										openInNewTab
									/>
								),
							}
						) }
					</Text>
				),
			} }
		/>
	);
}
