/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { RangeControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';
import { toNumber } from '../../../lib/helper';

export default function FastScrollSensitivity() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Fast Scroll Sensitivity', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			fastScrollSensitivity: value ? toNumber( value, 1, 10 ) : 5,
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
				value={ editorOptions.fastScrollSensitivity }
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={
					isAppleOS()
						? __(
								'Scrolling speed multiplier when pressing Option.',
								'custom-html-block-extension'
							)
						: __( 'Scrolling speed multiplier when pressing Alt.', 'custom-html-block-extension' )
				}
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'1'
						),
						image: 'editor-options/fast-scroll-sensitivity_1.gif',
						value: 1,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'5'
						),
						image: 'editor-options/fast-scroll-sensitivity_2.gif',
						value: 5,
						isDefault: true,
					},
				] }
				value={ editorOptions.fastScrollSensitivity }
			/>
		</Stack>
	);
}
