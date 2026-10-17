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
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';
import { toNumber } from '../../../lib/helper';

export default function ScrollBeyondLastColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Scroll Beyond Last Column', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			scrollBeyondLastColumn: undefined !== value ? toNumber( value, 0, 20 ) : 4,
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
				value={ editorOptions.scrollBeyondLastColumn }
				min={ 0 }
				max={ 20 }
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls the number of extra characters beyond which the editor will scroll horizontally.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'0'
						),
						image: 'editor-options/scroll-beyond-last-column_1.gif',
						value: 0,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'20'
						),
						image: 'editor-options/scroll-beyond-last-column_2.gif',
						value: 20,
					},
				] }
				value={ editorOptions.scrollBeyondLastColumn }
			/>
		</Stack>
	);
}
