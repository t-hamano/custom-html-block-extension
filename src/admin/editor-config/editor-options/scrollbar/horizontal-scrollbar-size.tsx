/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';
import { useDebounce } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';
import { toNumber } from '../../../../lib/helper';

export default function ScrollbarHorizontalScrollbarSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	// Debounce the refresh to avoid refreshing the editor every time the range is changed.
	const debouncedRefreshEditor = useDebounce( onRefreshEditor, 200 );

	const title = __( 'Horizontal scrollbar size', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( newValue: number | undefined ) => {
		const nextValue = newValue ? toNumber( newValue, 5, 30 ) : 10;
		setEditorOptions( ( prev ) => ( {
			...prev,
			scrollbar: {
				...prev.scrollbar,
				horizontalScrollbarSize: nextValue,
			},
		} ) );
		debouncedRefreshEditor();
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
				value={ editorOptions.scrollbar.horizontalScrollbarSize }
				min={ 5 }
				max={ 30 }
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'10'
						),
						image: 'editor-options/scrollbar/horizontal-scrollbar-size_1.jpg',
						value: 10,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'30'
						),
						image: 'editor-options/scrollbar/horizontal-scrollbar-size_2.jpg',
						value: 30,
					},
				] }
				value={ editorOptions.scrollbar.horizontalScrollbarSize }
			/>
		</Stack>
	);
}
