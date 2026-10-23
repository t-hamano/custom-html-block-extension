/**
 * External dependencies
 */
import type { ReactNode } from 'react';

export type SettingValue = string | number | boolean;

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
	description?: ReactNode;
	image?: string;
	// Choices shown in the help dialog. Not generated from `options` unless
	// `showOptions` is set.
	items?: SettingHelpItem< NoInfer< V > >[];
	// Show the control's options, with their images and descriptions, as the
	// choices in the help dialog.
	showOptions?: boolean;
	colCount?: 2 | 3 | 4 | 5;
};

type BaseSetting< V extends SettingValue > = {
	label: string;
	// Name of the group a setting belongs to, such as "Minimap". Searching for
	// the group finds its settings, and it is prepended to the label while
	// searching.
	group?: string;
	value: V;
	onChange: ( value: V ) => void;
	// Value of the setting by default. It marks the default choice in the help
	// dialog. It must match `Settings::DEFAULT_EDITOR_OPTIONS` (PHP).
	// `NoInfer` keeps the value type inferred from `value` alone, so these must
	// match it.
	defaultValue?: NoInfer< V >;
	help?: SettingHelp< V >;
};

export type ToggleSetting = BaseSetting< boolean > & {
	control: 'toggle';
};

export type SelectSetting< V extends SettingValue = SettingValue > = BaseSetting< V > & {
	control: 'select' | 'toggleGroup';
	options: SettingOption< NoInfer< V > >[];
};

export type RangeSetting = Omit< BaseSetting< number >, 'onChange' > & {
	control: 'range';
	// Receives `undefined` when the control is reset.
	onChange: ( value: number | undefined ) => void;
	min: number;
	max: number;
	step?: number;
	// Help text shown below the control.
	controlHelp?: string;
};

// Props of `SettingItem`; `control` selects the props each control accepts.
export type SettingItemProps< V extends SettingValue = SettingValue > =
	ToggleSetting | SelectSetting< V > | RangeSetting;
