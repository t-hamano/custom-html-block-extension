/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ColorIndicator, ColorPicker, Dropdown, RangeControl } from '@wordpress/components';
import { plus, trash } from '@wordpress/icons';
import { Button, IconButton, Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';
import { toNumber } from '../../../lib/helper';
import type { EditorOptions } from '../../../types';

const MAX_RULERS = 5;
const MAX_COLUMN = 100;

const getColumn = ( ruler: EditorOptions[ 'rulers' ][ number ] ) =>
	'number' === typeof ruler ? ruler : ruler.column;

const getColor = ( ruler: EditorOptions[ 'rulers' ][ number ] ) =>
	'number' === typeof ruler ? undefined : ruler.color;

// A ruler without a color is stored as a plain number so existing settings stay valid.
const toRuler = ( column: number, color?: string ): EditorOptions[ 'rulers' ][ number ] =>
	color ? { column, color } : column;

export default function Rulers() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Vertical line position', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const { rulers } = editorOptions;
	// No rulers is shown as a single control at `0`.
	const values: EditorOptions[ 'rulers' ] = rulers.length ? rulers : [ 0 ];
	const isSingle = values.length === 1;

	const updateRulers = ( nextRulers: EditorOptions[ 'rulers' ] ) => {
		setEditorOptions( {
			...editorOptions,
			rulers: nextRulers,
		} );
	};

	const onChange = ( index: number, value: number | undefined ) => {
		const nextValue = value ?? 0;
		if ( isSingle && 0 >= nextValue ) {
			updateRulers( [] );
			return;
		}
		updateRulers(
			values.map( ( item, i ) =>
				i === index ? toRuler( toNumber( nextValue, 1, MAX_COLUMN ), getColor( item ) ) : item
			)
		);
	};

	const onChangeColor = ( index: number, color?: string ) => {
		updateRulers(
			rulers.map( ( item, i ) => ( i === index ? toRuler( getColumn( item ), color ) : item ) )
		);
	};

	const onAdd = () => {
		updateRulers( [
			...rulers,
			toNumber( getColumn( rulers[ rulers.length - 1 ] ) + 10, 1, MAX_COLUMN ),
		] );
	};

	const onRemove = ( index: number ) => {
		updateRulers( rulers.filter( ( _, i ) => i !== index ) );
	};

	return (
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<Stack direction="column" align="start" gap="sm" style={ { width: '100%', maxWidth: 340 } }>
				{ values.map( ( ruler, index ) => (
					<Stack key={ index } align="end" gap="xs" style={ { width: '100%' } }>
						<div style={ { flex: 1 } }>
							<RangeControl
								label={
									0 === index
										? title
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
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Button
									variant="minimal"
									tone="neutral"
									size="compact"
									disabled={ ! rulers.length }
									aria-expanded={ isOpen }
									aria-label={ sprintf(
										/* translators: %d: The ruler number. */
										__( 'Vertical line %d color', 'custom-html-block-extension' ),
										index + 1
									) }
									onClick={ onToggle }
									style={ {
										width: 'var(--wpds-dimension-size-md)',
										minWidth: 0,
										paddingInline: 0,
										marginBottom: 4,
									} }
								>
									<ColorIndicator colorValue={ getColor( ruler ) } />
								</Button>
							) }
							renderContent={ () => (
								<Stack direction="column" align="end">
									<ColorPicker
										color={ getColor( ruler ) }
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
			<ItemHelp title={ title } image="editor-options/rulers.gif" />
		</Stack>
	);
}
