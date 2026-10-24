/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import {
	RangeControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { SelectControl, Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { EditorConfigContext, SettingsPanelContext, useSearchVisibility } from '../../index';
import ItemHelp from '../item-help';
import type { SettingItemProps, SettingOption, SettingValue } from './types';

/**
 * Renders a setting control, with the search visibility and the help dialog.
 *
 * @param props Props.
 */
export default function SettingItem< V extends SettingValue >( props: SettingItemProps< V > ) {
	// Inside, the value type of a select is not needed, so widen it.
	const setting = props as SettingItemProps;
	const { searchQuery } = useContext( EditorConfigContext );
	const { label, value } = setting;
	const panelTitle = useContext( SettingsPanelContext );

	const isVisible = useSearchVisibility( label );
	if ( ! isVisible ) {
		return null;
	}

	// While searching, show the panel the setting belongs to, so a label such
	// as "Side" reads as "Minimap: Side".
	const displayLabel =
		searchQuery && panelTitle && ! label.toLowerCase().includes( panelTitle.toLowerCase() )
			? sprintf(
					/* translators: 1: The name of the settings panel, such as "Minimap". 2: The setting name. */
					__( '%1$s: %2$s', 'custom-html-block-extension' ),
					panelTitle,
					label
				)
			: label;

	// The setting types narrow `onChange`, so call it through a common type.
	const onChange = setting.onChange as ( newValue: SettingValue ) => void;

	let control;
	let options: SettingOption< SettingValue >[] = [];

	switch ( setting.control ) {
		case 'toggle':
			options = ( setting.options ?? [] ).map( ( option ) => ( {
				...option,
				label: option.value
					? __( 'Enable', 'custom-html-block-extension' )
					: __( 'Disable', 'custom-html-block-extension' ),
			} ) );
			control = (
				<SwitchControl
					label={ displayLabel }
					checked={ value as boolean }
					onCheckedChange={ onChange }
				/>
			);
			break;
		case 'range':
			options = ( setting.options ?? [] ).map( ( option ) => ( {
				...option,
				label: sprintf(
					/* translators: %s is replaced with the number. */
					__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
					String( option.value )
				),
			} ) );
			control = (
				<RangeControl
					label={ displayLabel }
					value={ value as number }
					min={ setting.min }
					max={ setting.max }
					step={ setting.step }
					allowReset
					onChange={ setting.onChange }
					help={ setting.controlHelp }
				/>
			);
			break;
		case 'select': {
			options = setting.options;
			// SelectControl only accepts string values.
			const items = options.map( ( option ) => ( {
				label: option.label,
				value: String( option.value ),
			} ) );
			control = (
				<SelectControl
					label={ displayLabel }
					items={ items }
					value={ items.find( ( item ) => item.value === String( value ) ) ?? null }
					onValueChange={ ( item ) => {
						const option = options.find( ( { value: v } ) => String( v ) === item?.value );
						if ( option ) {
							onChange( option.value );
						}
					} }
				/>
			);
			break;
		}
		case 'toggleGroup':
			options = setting.options;
			control = (
				<ToggleGroupControl
					label={ displayLabel }
					value={ String( value ) }
					onChange={ ( newValue ) => {
						const option = options.find( ( { value: v } ) => String( v ) === String( newValue ) );
						if ( option ) {
							onChange( option.value );
						}
					} }
					isBlock
				>
					{ options.map( ( option ) => (
						<ToggleGroupControlOption
							key={ String( option.value ) }
							value={ String( option.value ) }
							label={ option.label }
						/>
					) ) }
				</ToggleGroupControl>
			);
			break;
	}

	const { help } = setting;
	const helpItems = help?.hideOptions ? [] : options;
	// Toggles without choices show the default and a switch in the help dialog.
	const isToggle = 'toggle' === setting.control && ! helpItems.length;

	return (
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			{ control }
			{ help && (
				<ItemHelp
					title={ label }
					description={ help.description }
					image={ help.image }
					items={ helpItems.map( ( item ) => ( {
						...item,
						isDefault: undefined !== setting.defaultValue && item.value === setting.defaultValue,
					} ) ) }
					colCount={ help.colCount }
					isToggle={ isToggle }
					defaultToggle={ isToggle ? !! setting.defaultValue : undefined }
					value={ value }
					onChange={ onChange }
				/>
			) }
		</Stack>
	);
}
