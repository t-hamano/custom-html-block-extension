/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';
import { toNumber } from '../../../lib/helper';

export default function Rulers() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Vertical line position', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		const nextValue = value ?? 0;
		setEditorOptions( {
			...editorOptions,
			rulers: 0 < nextValue ? [ toNumber( nextValue, 1, 80 ) ] : [],
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<RangeControl
					__next40pxDefaultSize
					label={ title }
					value={ editorOptions.rulers.length ? editorOptions.rulers[ 0 ] : 0 }
					min={ 0 }
					max={ 80 }
					allowReset
					onChange={ onChange }
				/>
				<ItemHelp onChange={ onChange } title={ title } image="editor-options/rulers.gif" />
			</HStack>
		</div>
	);
}
