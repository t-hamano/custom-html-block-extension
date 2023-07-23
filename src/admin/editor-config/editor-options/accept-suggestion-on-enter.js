/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import ItemHelp from '../components/item-help';

export default function AcceptSuggestionOnEnter() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			acceptSuggestionOnEnter: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Accept suggestions on enter key', 'custom-html-block-extension' ) }
				checked={ editorOptions.acceptSuggestionOnEnter }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Accept suggestions on enter key', 'custom-html-block-extension' ) }
				description={ createInterpolateElement(
					__(
						'Accept suggestions on <code>Enter</code> key in addition to <code>Tab</code> key.',
						'custom-html-block-extension'
					),
					{
						code: <code />,
					}
				) }
				isToggle
				defaultToggle={ true }
				value={ editorOptions.acceptSuggestionOnEnter }
			/>
		</div>
	);
}
