/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';

type FontWeightProps = {
	fontWeights: number[];
};

export default function FontWeight( { fontWeights }: FontWeightProps ) {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Font weight', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = fontWeights.map( ( fontWeight ) => ( {
		label: String( fontWeight ),
		value: String( fontWeight ),
	} ) );

	const onChange = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			fontWeight: value,
		} );
	};

	return (
		<Stack className="chbe-admin-editor-config__setting-item" gap="sm">
			<SelectControl
				label={ title }
				items={ items }
				value={
					items.find( ( item ) => item.value === String( editorOptions.fontWeight ) ) ?? null
				}
				onValueChange={ ( item ) => item?.value && onChange( item.value ) }
			/>
		</Stack>
	);
}
