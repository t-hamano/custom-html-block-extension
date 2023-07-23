/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import ItemHelp from '../components/item-help';

export default function UnfoldOnClickAfterEndOfLine() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			unfoldOnClickAfterEndOfLine: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __(
					'Expand folding line when clicking on empty content after a folded line',
					'custom-html-block-extension'
				) }
				checked={ editorOptions.unfoldOnClickAfterEndOfLine }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __(
					'Expand folding line when clicking on empty content after a folded line',
					'custom-html-block-extension'
				) }
				isToggle
				image={ 'editor-options/unfold-on-click-after-end-of-line.gif' }
				defaultToggle={ false }
				value={ editorOptions.unfoldOnClickAfterEndOfLine }
			/>
		</div>
	);
}
