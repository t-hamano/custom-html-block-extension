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

export default function StickyScrollMaxLineCount() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Maximum number of sticky lines', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			stickyScroll: {
				...editorOptions.stickyScroll,
				maxLineCount: value ? toNumber( value, 1, 20 ) : 5,
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
				label={ title }
				value={ editorOptions.stickyScroll.maxLineCount }
				min={ 1 }
				max={ 20 }
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				title={ title }
				description={ __(
					'The maximum number of lines that stay at the top of the editor while scrolling.',
					'custom-html-block-extension'
				) }
				image="editor-options/sticky-scroll/max-line-count.gif"
			/>
		</Stack>
	);
}
