/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';
import { toNumber } from '../../../lib/helper';

export default function LineNumbersMinChars() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Line number width', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			lineNumbersMinChars: value ? toNumber( value, 1, 10 ) : 5,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<Stack justify="start" align="start" wrap="wrap" gap="sm">
				<RangeControl
					__next40pxDefaultSize
					label={ title }
					value={ editorOptions.lineNumbersMinChars }
					min={ 1 }
					max={ 10 }
					allowReset
					onChange={ onChange }
				/>
				<ItemHelp title={ title } image="editor-options/line-numbers-min-chars.gif" />
			</Stack>
		</div>
	);
}
