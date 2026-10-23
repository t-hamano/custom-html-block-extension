/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import { toNumber } from '../../../../lib/helper';
import SettingItem from '../../components/setting-item';

export default function ScrollbarHorizontalScrollbarSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	// Debounce the refresh to avoid refreshing the editor every time the range is changed.
	const debouncedRefreshEditor = useDebounce( onRefreshEditor, 200 );

	const onChange = ( newValue: number | undefined ) => {
		const nextValue = newValue ? toNumber( newValue, 5, 30 ) : 12;
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
		<SettingItem
			control="range"
			label={ __( 'Horizontal Scrollbar Size (px)', 'custom-html-block-extension' ) }
			group={ __( 'Scrollbar', 'custom-html-block-extension' ) }
			value={ editorOptions.scrollbar.horizontalScrollbarSize }
			onChange={ onChange }
			min={ 5 }
			max={ 30 }
			defaultValue={ 12 }
			help={ {
				description: __( 'The height of the horizontal scrollbar.', 'custom-html-block-extension' ),
				items: [
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
				],
			} }
		/>
	);
}
