/**
 * External dependencies
 */
import type { ComponentType, ReactNode } from 'react';

/**
 * Internal dependencies
 */
import type { EditorOptions, EditorSettings } from '../../../types';

/**
 * State passed to the callbacks of a setting definition.
 */
export type SettingState = {
	editorSettings: EditorSettings;
	editorOptions: EditorOptions;
	// Font weights the preview font supports.
	fontWeights: number[];
};

/**
 * Keys changed by a setting. Nested option objects such as `minimap` are
 * merged into the current value, so only the changed keys need to be given.
 */
export type SettingChanges = {
	editorSettings?: Partial< EditorSettings >;
	editorOptions?: {
		[ K in keyof EditorOptions ]?: EditorOptions[ K ] extends unknown[]
			? EditorOptions[ K ]
			: EditorOptions[ K ] extends object
				? Partial< EditorOptions[ K ] >
				: EditorOptions[ K ];
	};
};

export type SettingValue = string | number | boolean;

/**
 * A value that may depend on the current state.
 */
export type MaybeCallback< T > = T | ( ( state: SettingState ) => T );

export type SettingOption< V extends SettingValue > = {
	label: string;
	value: V;
	// Shown in the help dialog when `help.showOptions` is set.
	image?: string;
	description?: ReactNode;
};

export type SettingHelpItem< V extends SettingValue > = SettingOption< V > & {
	title?: string;
};

/**
 * Content of the help dialog (`ItemHelp`).
 */
export type SettingHelp< V extends SettingValue > = {
	description?: MaybeCallback< ReactNode >;
	image?: string;
	// Choices shown in the help dialog. Not generated from `options` unless
	// `showOptions` is set.
	items?: SettingHelpItem< V >[];
	// Show the control's options, with their images and descriptions, as the
	// choices in the help dialog.
	showOptions?: boolean;
	colCount?: 2 | 3 | 4 | 5;
};

type BaseSetting< V extends SettingValue > = {
	// Unique ID, such as `minimap.side`.
	id: string;
	label: MaybeCallback< string >;
	// Name of the group a setting belongs to, such as "Minimap". Searching for
	// the group finds its settings, and it is prepended to the label while
	// searching.
	group?: string;
	// Extra text the search should match.
	searchText?: string;
	getValue: ( state: SettingState ) => V;
	setValue: ( value: V, state: SettingState ) => SettingChanges;
	// Value of the control when the setting has the default value. It marks
	// the default choice in the help dialog and is used when a range is
	// cleared. It must match `Settings::DEFAULT_EDITOR_OPTIONS` (PHP).
	defaultValue?: V;
	isDisabled?: ( state: SettingState ) => boolean;
	// Whether the preview editor has to be refreshed to reflect the change.
	shouldRefreshEditor?: boolean;
	help?: SettingHelp< V >;
};

export type ToggleSetting = BaseSetting< boolean > & {
	control: 'toggle';
};

export type SelectSetting< V extends SettingValue = SettingValue > = BaseSetting< V > & {
	control: 'select' | 'toggleGroup';
	options: MaybeCallback< SettingOption< V >[] >;
};

export type RangeSetting = BaseSetting< number > & {
	control: 'range';
	min: number;
	max: number;
	step?: number;
	defaultValue: number;
	// Help text shown below the control.
	controlHelp?: string;
};

export type CustomSetting = {
	control: 'custom';
	id: string;
	label: string;
	group?: string;
	searchText?: string;
	isDisabled?: ( state: SettingState ) => boolean;
	component: ComponentType< { label: string } >;
};

export type SettingDefinition = ToggleSetting | SelectSetting | RangeSetting | CustomSetting;

export type SettingPanel = {
	title: string;
	settings: SettingDefinition[];
};
