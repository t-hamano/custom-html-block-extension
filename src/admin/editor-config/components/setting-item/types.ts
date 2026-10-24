/**
 * External dependencies
 */
import type { ReactNode } from 'react';

export type SettingValue = string | number | boolean;

export type SettingOption< V extends SettingValue > = {
	label: string;
	value: V;
	image?: string;
	description?: ReactNode;
};

type SettingExample< V extends SettingValue > = Omit< SettingOption< V >, 'label' >;

type SettingHelp = {
	description?: ReactNode;
	image?: string;
	hideOptions?: boolean;
	colCount?: 2 | 3 | 4 | 5;
};

type BaseSetting< V extends SettingValue > = {
	name: string;
	label: string;
	value: V;
	onChange: ( value: V ) => void;
	// Must match `Settings::DEFAULT_EDITOR_OPTIONS` (PHP). `NoInfer` infers the
	// value type from `value` alone, so this must match it.
	defaultValue?: NoInfer< V >;
	help?: SettingHelp;
};

type ToggleSetting = BaseSetting< boolean > & {
	control: 'toggle';
	options?: SettingExample< boolean >[];
};

type SelectSetting< V extends SettingValue = SettingValue > = BaseSetting< V > & {
	control: 'select' | 'toggleGroup';
	options: SettingOption< NoInfer< V > >[];
};

type RangeSetting = Omit< BaseSetting< number >, 'onChange' > & {
	control: 'range';
	onChange: ( value: number | undefined ) => void;
	min: number;
	max: number;
	step?: number;
	options?: SettingExample< number >[];
};

export type SettingItemProps< V extends SettingValue = SettingValue > =
	ToggleSetting | SelectSetting< V > | RangeSetting;
