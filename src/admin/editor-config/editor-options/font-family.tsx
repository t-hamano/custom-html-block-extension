/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Link, Text } from '@wordpress/ui';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';
import { selectSetting } from '../components/setting-item/helpers';

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
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Font Family', 'custom-html-block-extension' ),
				value: editorOptions.fontFamily,
				onChange,
				options: [
					...window.chbeObj.fontFamily.map( ( { label, name } ) => ( {
						label: label ?? name,
						value: name,
					} ) ),
					{
						label: __( 'Monospace', 'custom-html-block-extension' ),
						value: 'monospace',
					},
				],
				help: {
					description: (
						<>
							<Text render={ <p /> }>
								{ __(
									'You can use your own favorite fonts in addition to the default fonts. Please refer to the following document for instructions on how to add custom fonts.',
									'custom-html-block-extension'
								) }
							</Text>
							<Text render={ <p /> }>
								<Link
									href={ __(
										'https://github.com/t-hamano/custom-html-block-extension#add-custom-fonts',
										'custom-html-block-extension'
									) }
									openInNewTab
								>
									{ __( 'GitHub project page', 'custom-html-block-extension' ) }
								</Link>
							</Text>
						</>
					),
				},
			} ) }
		/>
	);
}
