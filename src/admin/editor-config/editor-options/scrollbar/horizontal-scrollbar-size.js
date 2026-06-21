/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useContext, useState } from '@wordpress/element';
import { RangeControl, __experimentalHStack as HStack } from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import ItemHelp from '../../components/item-help';
import { toNumber } from '../../../../lib/helper';

export default function ScrollbarHorizontalScrollbarSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor, searchQuery } = useContext( EditorConfigContext );
	const [ value, setValue ] = useState( editorOptions.scrollbar.horizontalScrollbarSize );

	// Debounce the function to avoid refreshing the editor every time the range is changed.
	const onChangeOption = useCallback(
		( newValue ) => {
			onRefreshEditor();
			setEditorOptions( ( prev ) => ( {
				...prev,
				scrollbar: {
					...prev.scrollbar,
					horizontalScrollbarSize: newValue,
				},
			} ) );
		},
		[ onRefreshEditor, setEditorOptions ]
	);
	const debouncedOnChange = useDebounce( onChangeOption, 200 );

	const title = __( 'Horizontal scrollbar size', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( newValue ) => {
		const nextValue = newValue ? toNumber( newValue, 5, 30 ) : 10;
		setValue( nextValue );
		debouncedOnChange( nextValue );
	};

	return (
		<HStack justify="start" align="start" wrap>
			<RangeControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ title }
				value={ value }
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
							10
						),
						image: 'editor-options/scrollbar/horizontal-scrollbar-size_1.jpg',
						value: 10,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							30
						),
						image: 'editor-options/scrollbar/horizontal-scrollbar-size_2.jpg',
						value: 30,
					},
				] }
				value={ value }
			/>
		</HStack>
	);
}
