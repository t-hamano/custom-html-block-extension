/**
 * Internal dependencies
 */
import type { EditorOptions, EditorSettings } from '../../../types';
import type {
	SettingChanges,
	SettingState,
	SettingValue,
	SelectSetting,
	SettingDefinition,
} from './types';

type Accessor< V > = {
	getValue: ( state: SettingState ) => V;
	setValue: ( value: V, state: SettingState ) => SettingChanges;
};

/**
 * Reads and writes a key of `editorSettings`.
 *
 * @param key Key of `editorSettings`.
 */
export function editorSetting< K extends keyof EditorSettings >(
	key: K
): Accessor< EditorSettings[ K ] > {
	return {
		getValue: ( { editorSettings } ) => editorSettings[ key ],
		setValue: ( value ) => ( { editorSettings: { [ key ]: value } } ),
	};
}

/**
 * Reads and writes a key of `editorOptions`, or a key of a nested option
 * object such as `minimap`.
 *
 * @param key Key of `editorOptions`.
 */
export function editorOption< K extends keyof EditorOptions >(
	key: K
): Accessor< EditorOptions[ K ] >;
export function editorOption< K extends keyof EditorOptions, C extends keyof EditorOptions[ K ] >(
	key: K,
	childKey: C
): Accessor< EditorOptions[ K ][ C ] >;
export function editorOption( key: keyof EditorOptions, childKey?: string ): Accessor< any > {
	if ( undefined === childKey ) {
		return {
			getValue: ( { editorOptions } ) => editorOptions[ key ],
			setValue: ( value ) => ( { editorOptions: { [ key ]: value } } ),
		};
	}
	return {
		getValue: ( { editorOptions } ) =>
			( editorOptions[ key ] as Record< string, unknown > )[ childKey ],
		setValue: ( value ) => ( { editorOptions: { [ key ]: { [ childKey ]: value } } } ),
	};
}

/**
 * Keeps the value type of a select or toggle group setting checked against
 * its options and accessors.
 *
 * @param setting Setting definition.
 */
export function selectSetting< V extends SettingValue >(
	setting: SelectSetting< V >
): SettingDefinition {
	return setting as unknown as SettingDefinition;
}

/**
 * Resolves a value that may depend on the current state.
 *
 * @param value Value or callback.
 * @param state Current state.
 */
export function resolve< T >(
	value: T | ( ( state: SettingState ) => T ),
	state: SettingState
): T {
	return 'function' === typeof value ? ( value as ( state: SettingState ) => T )( state ) : value;
}

/**
 * Applies the changes returned by `setValue`. Nested option objects are
 * merged one level deep; arrays and other values are replaced.
 *
 * @param current Current value.
 * @param changes Changed keys.
 */
export function mergeChanges< T extends object >( current: T, changes: object ): T {
	const next = { ...current } as Record< string, unknown >;
	Object.entries( changes ).forEach( ( [ key, value ] ) => {
		const currentValue = next[ key ];
		next[ key ] =
			value &&
			'object' === typeof value &&
			! Array.isArray( value ) &&
			currentValue &&
			'object' === typeof currentValue &&
			! Array.isArray( currentValue )
				? { ...currentValue, ...value }
				: value;
	} );
	return next as T;
}
