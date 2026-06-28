/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function AcceptSuggestionOnEnter() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Accept suggestions on enter key', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			acceptSuggestionOnEnter: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl
					label={ title }
					checked={ editorOptions.acceptSuggestionOnEnter }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
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
					defaultToggle
					value={ editorOptions.acceptSuggestionOnEnter }
				/>
			</HStack>
		</div>
	);
}
