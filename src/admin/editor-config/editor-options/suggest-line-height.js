/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import ItemHelp from '../components/item-help';
import { toNumber } from '../../../lib/helper';

export default function SuggestLineHeight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			suggestLineHeight: value ? toNumber( value, 10, 60 ) : 24,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Suggest line height (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.suggestLineHeight }
				min="10"
				max="60"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Suggest line height (px)', 'custom-html-block-extension' ) }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							10
						),
						image: 'editor-options/suggest-line-height_1.jpg',
						value: 10,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							30
						),
						image: 'editor-options/suggest-line-height_2.jpg',
						value: 30,
					},
				] }
				value={ editorOptions.suggestLineHeight }
			/>
		</div>
	);
}
