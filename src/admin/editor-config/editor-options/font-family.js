/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ExternalLink, SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function FontFamily() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			fontFamily: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Font family', 'custom-html-block-extension' ) }
				value={ editorOptions.fontFamily }
				options={ window.chbeObj.fontFamily.map( ( { label, name } ) => ( {
					label,
					value: name,
				} ) ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Font family', 'custom-html-block-extension' ) }
				description={
					<>
						<p>
							{ __(
								'You can use your own favorite fonts in addition to the default fonts. Please refer to the following document for instructions on how to add custom fonts.',
								'custom-html-block-extension'
							) }
						</p>
						<p>
							<ExternalLink
								href={ __(
									'https://github.com/t-hamano/custom-html-block-extension#add-custom-fonts',
									'custom-html-block-extension'
								) }
							>
								{ __( 'GitHub Project Page', 'custom-html-block-extension' ) }
							</ExternalLink>
						</p>
					</>
				}
			/>
		</div>
	);
}
