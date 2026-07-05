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
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';
import { toNumber } from '../../../../lib/helper';

export default function PaddingBottom() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Padding bottom (px)', 'custom-html-block-extension' );

	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			padding: {
				...editorOptions.padding,
				bottom: value ? toNumber( value, 0, 50 ) : 0,
			},
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
			<RangeControl
				__next40pxDefaultSize
				label={ title }
				value={ editorOptions.padding.bottom }
				min={ 0 }
				max={ 50 }
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Spacing between bottom edge of editor and last line. This setting will not work if "Scroll past the last line" is enabled in "Mouse and Scroll" category.',
					'custom-html-block-extension'
				) }
				image="editor-options/padding/bottom.gif"
			/>
		</Stack>
	);
}
