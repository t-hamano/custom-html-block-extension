/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

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

	const onChange = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			fontWeight: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ String( editorOptions.fontWeight ) }
					options={ fontWeights.map( ( fontWeight ) => ( {
						label: String( fontWeight ),
						value: String( fontWeight ),
					} ) ) }
					onChange={ onChange }
				/>
			</HStack>
		</div>
	);
}
