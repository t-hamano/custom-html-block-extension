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
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';
import { toNumber } from '../../../../lib/helper';

const DEFAULT_DELAY = 300;

export default function HoverDelay() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Hover Delay (ms)', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			hover: {
				...editorOptions.hover,
				delay: undefined === value ? DEFAULT_DELAY : toNumber( value, 0, 3000 ),
			},
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
				value={ editorOptions.hover.delay }
				min={ 0 }
				max={ 3000 }
				step={ 50 }
				allowReset
				resetFallbackValue={ DEFAULT_DELAY }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'300'
						),
						image: 'editor-options/hover/delay_1.gif',
						description: __(
							'The hover is shown shortly after the mouse stops over the code.',
							'custom-html-block-extension'
						),
						value: 300,
						isDefault: true,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'1500'
						),
						image: 'editor-options/hover/delay_2.gif',
						description: __(
							'The hover is shown only after the mouse rests over the code for a while, so it does not get in the way while moving the mouse.',
							'custom-html-block-extension'
						),
						value: 1500,
					},
				] }
				value={ editorOptions.hover.delay }
			/>
		</Stack>
	);
}
