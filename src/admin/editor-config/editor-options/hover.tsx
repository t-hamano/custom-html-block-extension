/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function Hover() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable hover hints', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			hover: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl label={ title } checked={ editorOptions.hover } onChange={ onChange } />
				<ItemHelp
					onChange={ onChange }
					title={ title }
					isToggle
					defaultToggle
					image="editor-options/hover.gif"
					value={ editorOptions.hover }
				/>
			</HStack>
		</div>
	);
}
