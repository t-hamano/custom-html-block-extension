/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';
import { toNumber } from '../../../lib/helper';

export default function MouseWheelScrollSensitivity() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Mouse Wheel Scroll Sensitivity', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			mouseWheelScrollSensitivity: value ? toNumber( value, 1, 10 ) : 1,
		} );
	};

	return (
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<RangeControl
				label={ title }
				min={ 1 }
				max={ 10 }
				value={ editorOptions.mouseWheelScrollSensitivity }
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'A multiplier for the distance scrolled by the mouse wheel.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'1'
						),
						image: 'editor-options/mouse-wheel-scroll-sensitivity_1.gif',
						value: 1,
						isDefault: true,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'3'
						),
						image: 'editor-options/mouse-wheel-scroll-sensitivity_2.gif',
						value: 3,
					},
				] }
				value={ editorOptions.mouseWheelScrollSensitivity }
			/>
		</Stack>
	);
}
