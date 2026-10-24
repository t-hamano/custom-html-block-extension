/**
 * External dependencies
 */
import type { ReactNode } from 'react';

export type SettingValue = string | number | boolean;

export type SettingOption< V extends SettingValue > = {
	label: string;
	value: V;
	// Shown in the help dialog unless `help.hideOptions` is set.
	image?: string;
	description?: ReactNode;
};

// Choice of a toggle or range in the help dialog. The label is generated from
// the value.
type SettingExample< V extends SettingValue > = Omit< SettingOption< V >, 'label' >;

/**
 * Content of the help dialog (`ItemHelp`).
 */
type SettingHelp = {
	description?: ReactNode;
	image?: string;
	// Show only the description, without the control's options as choices.
	hideOptions?: boolean;
	colCount?: 2 | 3 | 4 | 5;
};

type BaseSetting< V extends SettingValue > = {
	// Key of the setting, such as "guides.indentation". The search also matches
	// it, so searching for an option group such as "Guides" finds the setting.
	name: string;
	label: string;
	value: V;
	onChange: ( value: V ) => void;
	// Value of the setting by default. It marks the default choice in the help
	// dialog. It must match `Settings::DEFAULT_EDITOR_OPTIONS` (PHP).
	// `NoInfer` keeps the value type inferred from `value` alone, so these must
	// match it.
	defaultValue?: NoInfer< V >;
	help?: SettingHelp;
};

type ToggleSetting = BaseSetting< boolean > & {
	control: 'toggle';
	// Shown as "Enable" and "Disable" in the help dialog.
	options?: SettingExample< boolean >[];
};

type SelectSetting< V extends SettingValue = SettingValue > = BaseSetting< V > & {
	control: 'select' | 'toggleGroup';
	options: SettingOption< NoInfer< V > >[];
};

type RangeSetting = Omit< BaseSetting< number >, 'onChange' > & {
	control: 'range';
	// Receives `undefined` when the control is reset.
	onChange: ( value: number | undefined ) => void;
	min: number;
	max: number;
	step?: number;
	// Help text shown below the control.
	controlHelp?: string;
	// Shown as "Example: Set the value to N" in the help dialog.
	options?: SettingExample< number >[];
};

// Props of `SettingItem`; `control` selects the props each control accepts.
export type SettingItemProps< V extends SettingValue = SettingValue > =
	ToggleSetting | SelectSetting< V > | RangeSetting;
