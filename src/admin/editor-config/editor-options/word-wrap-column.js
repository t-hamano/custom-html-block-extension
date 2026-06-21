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

export default function WordWrapColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Word wrap column', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			wordWrapColumn: value ? toNumber( value, 20, 200 ) : 80,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" align="start" wrap>
				<RangeControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ editorOptions.wordWrapColumn }
					min={ 20 }
					max={ 200 }
					allowReset
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					image="editor-options/word-wrap-column.gif"
					value={ editorOptions.wordWrapColumn }
				/>
			</HStack>
		</div>
	);
}
