/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
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

	const title = __( 'Max Line Count', 'custom-html-block-extension' );
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
				onChange={ onChange }
				title={ title }
				description={ __(
					'Defines the maximum number of sticky lines to show.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'2'
						),
						image: 'editor-options/sticky-scroll/max-line-count_1.gif',
						value: 2,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'5'
						),
						image: 'editor-options/sticky-scroll/max-line-count_2.gif',
						value: 5,
					},
				] }
				value={ editorOptions.stickyScroll.maxLineCount }
			/>
		</Stack>
	);
}
