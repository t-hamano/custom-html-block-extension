/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext, useEffect, useState } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';
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
	const debouncedOnChange = useDebounce( ( newValue ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				horizontalScrollbarSize: newValue,
			},
		} );
	}, 200 );

	useEffect( () => {
		if ( editorOptions.scrollbar.horizontalScrollbarSize === value ) {
			return;
		}
		debouncedOnChange( value );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ value ] );

	const title = __( 'Horizontal scrollbar size', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( newValue ) => {
		setValue( newValue ? toNumber( newValue, 5, 30 ) : 10 );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ title }
				value={ value }
				min="5"
				max="30"
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
		</div>
	);
}
