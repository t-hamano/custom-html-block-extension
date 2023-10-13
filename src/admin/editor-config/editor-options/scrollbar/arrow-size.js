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

export default function ScrollbarArrowSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor, searchQuery } = useContext( EditorConfigContext );
	const [ value, setValue ] = useState( editorOptions.scrollbar.arrowSize );

	// Debounce the function to avoid refreshing the editor every time the range is changed.
	const debouncedOnChange = useDebounce( ( newValue ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				arrowSize: newValue,
			},
		} );
	}, 200 );

	useEffect( () => {
		if ( editorOptions.scrollbar.arrowSize === value ) {
			return;
		}
		debouncedOnChange( value );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ value ] );

	const title = __( 'Arrow area size', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( newValue ) => {
		setValue( newValue ? toNumber( newValue, 5, 50 ) : 11 );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ title }
				value={ value }
				min="5"
				max="50"
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
						image: 'editor-options/scrollbar/arrow-size_1.jpg',
						value: 10,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							30
						),
						image: 'editor-options/scrollbar/arrow-size_2.jpg',
						value: 30,
					},
				] }
				value={ value }
			/>
		</div>
	);
}
