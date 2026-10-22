/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ColorIndicator, ColorPicker, Dropdown, RangeControl } from '@wordpress/components';
import { plus, trash } from '@wordpress/icons';
import { Button, IconButton, Stack, Tooltip } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import ItemHelp from '../../components/item-help';
import { toNumber } from '../../../../lib/helper';
import type { EditorOptions } from '../../../../types';

const MAX_RULERS = 5;
const MAX_COLUMN = 100;

type Ruler = EditorOptions[ 'rulers' ][ number ];

const getColumn = ( ruler: Ruler ) => ( 'number' === typeof ruler ? ruler : ruler.column );

const getColor = ( ruler: Ruler ) => ( 'number' === typeof ruler ? undefined : ruler.color );

// A ruler without a color is stored as a plain number so existing settings stay valid.
const toRuler = ( column: number, color?: string ): Ruler => ( color ? { column, color } : column );

// No rulers is shown as a single control at `0`.
const toValues = ( rulers: EditorOptions[ 'rulers' ] ): EditorOptions[ 'rulers' ] =>
	rulers.length ? rulers : [ 0 ];

export default function Rulers( { label }: { label: string } ) {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const { rulers } = editorOptions;
	const values = toValues( rulers );
	const isSingle = values.length === 1;

	const updateRulers = (
		getNextRulers: ( current: EditorOptions[ 'rulers' ] ) => EditorOptions[ 'rulers' ]
	) => {
		setEditorOptions( ( current ) => ( {
			...current,
			rulers: getNextRulers( current.rulers ),
		} ) );
	};

	const onChange = ( index: number, value: number | undefined ) => {
		const nextValue = value ?? 0;
		updateRulers( ( currentRulers ) => {
			const currentValues = toValues( currentRulers );
			if ( currentValues.length === 1 && 0 >= nextValue ) {
				return [];
			}
			return currentValues.map( ( item, i ) =>
				i === index ? toRuler( toNumber( nextValue, 1, MAX_COLUMN ), getColor( item ) ) : item
			);
		} );
	};

	const onChangeColor = ( index: number, color?: string ) => {
		updateRulers( ( currentRulers ) =>
			currentRulers.map( ( item, i ) =>
				i === index ? toRuler( getColumn( item ), color ) : item
			)
		);
	};

	const onAdd = () => {
		updateRulers( ( currentRulers ) => [
			...currentRulers,
			toNumber( getColumn( currentRulers[ currentRulers.length - 1 ] ) + 10, 1, MAX_COLUMN ),
		] );
	};

	const onRemove = ( index: number ) => {
		updateRulers( ( currentRulers ) => currentRulers.filter( ( _, i ) => i !== index ) );
	};

	return (
		<>
			<Stack direction="column" align="start" gap="sm" style={ { width: '100%', maxWidth: 300 } }>
				{ values.map( ( ruler, index ) => (
					<Stack key={ index } align="end" gap="xs" style={ { width: '100%' } }>
						<div style={ { flex: 1 } }>
							<RangeControl
								label={
									0 === index
										? label
										: sprintf(
												/* translators: %d: The ruler number. */
												__( 'Vertical line position %d', 'custom-html-block-extension' ),
												index + 1
											)
								}
								hideLabelFromVision={ 0 !== index }
								value={ getColumn( ruler ) }
								min={ isSingle ? 0 : 1 }
								max={ MAX_COLUMN }
								onChange={ ( newValue ) => onChange( index, newValue ) }
							/>
						</div>
						<Dropdown
							popoverProps={ { placement: 'bottom-end' } }
							renderToggle={ ( { isOpen, onToggle } ) => {
								const colorLabel = sprintf(
									/* translators: %d: The ruler number. */
									__( 'Vertical line %d color', 'custom-html-block-extension' ),
									index + 1
								);
								return (
									<Tooltip.Root>
										<Tooltip.Trigger
											render={
												<Button
													variant="minimal"
													tone="neutral"
													size="compact"
													disabled={ ! rulers.length }
													focusableWhenDisabled
													aria-expanded={ isOpen }
													aria-label={ colorLabel }
													onClick={ onToggle }
													style={ {
														marginBottom: 4,
														// Make the button square like `IconButton`. The default
														// `min-width` and inline padding make it wider than its height.
														width: 'var(--wpds-dimension-size-md)',
														minWidth: 0,
														paddingInline: 0,
													} }
												/>
											}
										>
											<ColorIndicator colorValue={ getColor( ruler ) } />
										</Tooltip.Trigger>
										<Tooltip.Popup>{ colorLabel }</Tooltip.Popup>
									</Tooltip.Root>
								);
							} }
							renderContent={ () => (
								<Stack direction="column" align="end">
									<ColorPicker
										color={ getColor( ruler ) ?? '#fff' }
										onChange={ ( color ) => onChangeColor( index, color ) }
									/>
									<Button
										variant="outline"
										size="compact"
										disabled={ ! getColor( ruler ) }
										onClick={ () => onChangeColor( index ) }
									>
										{ __( 'Reset', 'custom-html-block-extension' ) }
									</Button>
								</Stack>
							) }
						/>
						<IconButton
							icon={ trash }
							label={ __( 'Remove ruler', 'custom-html-block-extension' ) }
							variant="minimal"
							tone="neutral"
							size="compact"
							disabled={ isSingle }
							onClick={ () => onRemove( index ) }
							style={ { marginBottom: 4 } }
						/>
					</Stack>
				) ) }
				<Button
					variant="outline"
					size="compact"
					disabled={ ! rulers.length || rulers.length >= MAX_RULERS }
					onClick={ onAdd }
				>
					<Button.Icon icon={ plus } />
					{ __( 'Add ruler', 'custom-html-block-extension' ) }
				</Button>
			</Stack>
			<ItemHelp
				title={ label }
				description={ __(
					'Render vertical rulers after a certain number of monospace characters. Use multiple values for multiple rulers.',
					'custom-html-block-extension'
				) }
				image="editor-options/rulers.gif"
			/>
		</>
	);
}
