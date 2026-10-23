/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import { toNumber } from '../../../../lib/helper';
import SettingItem from '../../components/setting-item';

export default function ScrollbarArrowSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	// Debounce the refresh to avoid refreshing the editor every time the range is changed.
	const debouncedRefreshEditor = useDebounce( onRefreshEditor, 200 );

	const onChange = ( newValue: number | undefined ) => {
		const nextValue = newValue ? toNumber( newValue, 5, 50 ) : 11;
		setEditorOptions( ( prev ) => ( {
			...prev,
			scrollbar: {
				...prev.scrollbar,
				arrowSize: nextValue,
			},
		} ) );
		debouncedRefreshEditor();
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Arrow Size (px)', 'custom-html-block-extension' ) }
			group="scrollbar"
			value={ editorOptions.scrollbar.arrowSize }
			onChange={ onChange }
			min={ 5 }
			max={ 50 }
			defaultValue={ 11 }
			options={ [
				{
					image: 'editor-options/scrollbar/arrow-size_1.jpg',
					value: 10,
				},
				{
					image: 'editor-options/scrollbar/arrow-size_2.jpg',
					value: 30,
				},
			] }
			help={ {
				description: __(
					'Controls the size of the scrollbar arrows.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
