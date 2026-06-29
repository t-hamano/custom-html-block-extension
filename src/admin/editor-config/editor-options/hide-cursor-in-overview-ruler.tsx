/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function HideCursorInOverviewRuler() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Hide cursor position on scroll bar', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			hideCursorInOverviewRuler: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<Stack justify="start" align="start" wrap="wrap" gap="sm">
				<ToggleControl
					label={ title }
					checked={ editorOptions.hideCursorInOverviewRuler }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/hide-cursor-in-overview-ruler_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/hide-cursor-in-overview-ruler_2.jpg',
							isDefault: true,
						},
					] }
					value={ editorOptions.hideCursorInOverviewRuler }
				/>
			</Stack>
		</div>
	);
}
