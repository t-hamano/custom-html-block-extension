/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Link, SelectControl, Stack, Text } from '@wordpress/ui';

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

	const items = [
		...window.chbeObj.fontFamily.map( ( { label, name } ) => ( {
			label: label ?? name,
			value: name,
		} ) ),
		{
			label: __( 'Monospace', 'custom-html-block-extension' ),
			value: 'monospace',
		},
	];

	const onChange = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			fontFamily: value,
		} );
	};

	return (
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SelectControl
				label={ title }
				items={ items }
				value={ items.find( ( item ) => item.value === editorOptions.fontFamily ) ?? null }
				onValueChange={ ( item ) => item?.value && onChange( item.value ) }
			/>
			<ItemHelp
				title={ title }
				description={
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
				}
			/>
		</Stack>
	);
}
