/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import {
	ExternalLink,
	SelectControl,
	__experimentalText as Text,
	__experimentalHStack as HStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function FontFamily() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Font family', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			fontFamily: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ editorOptions.fontFamily }
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
					onChange={ onChange }
				/>
				<ItemHelp
					title={ title }
					description={
						<>
							<Text as="p">
								{ __(
									'You can use your own favorite fonts in addition to the default fonts. Please refer to the following document for instructions on how to add custom fonts.',
									'custom-html-block-extension'
								) }
							</Text>
							<Text as="p">
								<ExternalLink
									href={ __(
										'https://github.com/t-hamano/custom-html-block-extension#add-custom-fonts',
										'custom-html-block-extension'
									) }
								>
									{ __( 'GitHub project page', 'custom-html-block-extension' ) }
								</ExternalLink>
							</Text>
						</>
					}
				/>
			</HStack>
		</div>
	);
}
