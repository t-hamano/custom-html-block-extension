/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';
import { toNumber } from 'lib/helper';

export default function QuickSuggestionsDelay() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			quickSuggestionsDelay: value ? toNumber( value, 0, 1000 ) : 10,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Time until suggestions are displayed (ms)', 'custom-html-block-extension' ) }
				value={ editorOptions.quickSuggestionsDelay }
				min="0"
				max="1000"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Time until suggestions are displayed (ms)', 'custom-html-block-extension' ) }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							10
						),
						image: 'editor-options/quick-suggestions-delay_1.gif',
						value: 10,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							1000
						),
						image: 'editor-options/quick-suggestions-delay_2.gif',
						value: 1000,
					},
				] }
				value={ editorOptions.quickSuggestionsDelay }
			/>
		</div>
	);
}
