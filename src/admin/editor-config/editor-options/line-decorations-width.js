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

export default function LineDecorationsWidth() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Folding area width (px)', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			lineDecorationsWidth: value ? toNumber( value, 0, 30 ) : 0,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" align="start" wrap>
				<RangeControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ editorOptions.lineDecorationsWidth }
					min={ 0 }
					max={ 30 }
					allowReset
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					image="editor-options/line-decorations-width.gif"
					value={ editorOptions.lineDecorationsWidth }
				/>
			</HStack>
		</div>
	);
}
