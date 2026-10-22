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
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import ItemHelp from '../item-help';
import { SETTING_ITEM_CLASS_NAME, matchesSearch } from '../../search';
import { mergeChanges, resolve } from '../../settings/helpers';
import type {
	SettingDefinition,
	SettingState,
	SettingValue,
	SettingHelpItem,
} from '../../settings/types';
import { toNumber } from '../../../../lib/helper';

// Value for the `inert` attribute; the empty string enables it (React 18 form).
function inertValue( condition: boolean ): '' | undefined {
	return condition ? '' : undefined;
}

/**
 * Renders a setting from its definition, with the search visibility, the
 * disabled state, and the help dialog.
 *
 * @param props         Props.
 * @param props.setting Setting definition.
 */
export default function SettingItem( { setting }: { setting: SettingDefinition } ) {
	const { editorSettings, editorOptions, setEditorSettings, setEditorOptions } =
		useContext( AdminContext );
	const { searchQuery, fontWeights, onRefreshEditor } = useContext( EditorConfigContext );

	const state: SettingState = { editorSettings, editorOptions, fontWeights };
	const label = resolve( setting.label, state );
	const { group } = setting;

	const searchText = [ group, label, setting.searchText ].filter( Boolean ).join( ' ' );
	if ( ! matchesSearch( searchQuery, searchText ) ) {
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

	const isDisabled = !! setting.isDisabled?.( state );

	const wrapperProps = {
		className: SETTING_ITEM_CLASS_NAME,
		justify: 'start',
		align: 'start',
		wrap: 'wrap',
		gap: 'sm',
		inert: inertValue( isDisabled ),
	} as const;

	if ( 'custom' === setting.control ) {
		const Component = setting.component;
		return (
			<Stack { ...wrapperProps }>
				<Component label={ displayLabel } />
			</Stack>
		);
	}

	const value = setting.getValue( state );

	const onChange = ( newValue: SettingValue ) => {
		const changes = ( setting.setValue as ( v: SettingValue, s: SettingState ) => object )(
			newValue,
			state
		);
		const { editorSettings: settingsChanges, editorOptions: optionsChanges } = changes as {
			editorSettings?: object;
			editorOptions?: object;
		};
		if ( settingsChanges ) {
			setEditorSettings( ( current ) => mergeChanges( current, settingsChanges ) );
		}
		if ( optionsChanges ) {
			setEditorOptions( ( current ) => mergeChanges( current, optionsChanges ) );
		}
		if ( setting.shouldRefreshEditor ) {
			onRefreshEditor();
		}
	};

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
					resetFallbackValue={ setting.defaultValue }
					onChange={ ( newValue ) =>
						onChange(
							undefined === newValue
								? setting.defaultValue
								: toNumber( newValue, setting.min, setting.max )
						)
					}
					help={ setting.controlHelp }
				/>
			);
			break;
		case 'select': {
			options = resolve( setting.options, state );
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
			options = resolve( setting.options, state );
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
		<Stack { ...wrapperProps }>
			{ control }
			{ help && (
				<ItemHelp
					title={ label }
					description={ resolve( help.description, state ) }
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
