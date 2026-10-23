/**
 * Internal dependencies
 */
import type { SettingValue, SelectSetting, SettingDefinition } from './types';

/**
 * Keeps the value type of a select or toggle group setting checked against
 * its options and `onChange`.
 *
 * @param setting Setting definition.
 */
export function selectSetting< V extends SettingValue >(
	setting: SelectSetting< V >
): SettingDefinition {
	return setting as unknown as SettingDefinition;
}
