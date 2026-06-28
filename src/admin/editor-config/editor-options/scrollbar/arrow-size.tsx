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
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';
import { toNumber } from '../../../../lib/helper';

export default function ScrollbarArrowSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );
	const [ value, setValue ] = useState( editorOptions.scrollbar.arrowSize );

	// Debounce the function to avoid refreshing the editor every time the range is changed.
	const onChangeOption = useCallback(
		( newValue: number ) => {
			onRefreshEditor();
			setEditorOptions( ( prev ) => ( {
				...prev,
				scrollbar: {
					...prev.scrollbar,
					arrowSize: newValue,
				},
			} ) );
		},
		[ onRefreshEditor, setEditorOptions ]
	);
	const debouncedOnChange = useDebounce( onChangeOption, 200 );

	const title = __( 'Arrow area size', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( newValue: number | undefined ) => {
		const nextValue = newValue ? toNumber( newValue, 5, 50 ) : 11;
		setValue( nextValue );
		debouncedOnChange( nextValue );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<RangeControl
					__next40pxDefaultSize
					label={ title }
					value={ value }
					min={ 5 }
					max={ 50 }
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
							image: 'editor-options/scrollbar/arrow-size_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/scrollbar/arrow-size_2.jpg',
							value: 30,
						},
					] }
					value={ value }
				/>
			</HStack>
		</div>
	);
}
