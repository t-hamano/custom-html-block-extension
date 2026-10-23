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
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../item-help';
import type { SettingDefinition, SettingValue, SettingHelpItem } from './types';

/**
 * Renders a setting from its definition, with the search visibility and the
 * help dialog.
 *
 * @param props         Props.
 * @param props.setting Setting definition.
 */
export default function SettingItem( { setting }: { setting: SettingDefinition } ) {
	const { searchQuery } = useContext( EditorConfigContext );
	const { label, group, value } = setting;

	const isVisible = useSearchVisibility( label, group );
	if ( ! isVisible ) {
		return null;
	}

	// While searching, show the group the setting belongs to, so a label such
	// as "Side" reads as "Minimap: Side".
	const displayLabel =
		searchQuery && group && ! label.toLowerCase().includes( group.toLowerCase() )
			? sprintf(
					/* translators: 1: The name of the setting group, such as "Minimap". 2: The setting name. */
					__( '%1$s: %2$s', 'custom-html-block-extension' ),
					group,
					label
				)
			: label;

	// The setting types narrow `onChange`, so call it through a common type.
	const onChange = setting.onChange as ( newValue: SettingValue ) => void;

	let control;
	let options: { label: string; value: SettingValue; image?: string }[] = [];

	switch ( setting.control ) {
		case 'toggle':
			control = (
				<SwitchControl
					label={ displayLabel }
					checked={ value as boolean }
					onCheckedChange={ onChange }
				/>
			);
			break;
		case 'range':
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
	let helpItems: SettingHelpItem< SettingValue >[] | undefined;
	if ( help?.showOptions ) {
		helpItems = options;
	} else if ( help?.items ) {
		helpItems = help.items as SettingHelpItem< SettingValue >[];
	}
	// Toggles without choices show the default and a switch in the help dialog.
	const isToggle = 'toggle' === setting.control && ! helpItems;

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
					items={ helpItems?.map( ( item ) => ( {
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
