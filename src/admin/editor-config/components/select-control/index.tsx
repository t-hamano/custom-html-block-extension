/**
 * WordPress dependencies
 */
import { SelectControl as UISelectControl } from '@wordpress/ui';

type SelectControlProps< T extends string > = {
	label: string;
	value: T;
	options: readonly { label: string; value: T }[];
	onChange: ( value: T ) => void;
};

// `SelectControl` from `@wordpress/ui` selects item objects. This wrapper keeps
// the plain string values of the settings.
export default function SelectControl< T extends string >( {
	label,
	value,
	options,
	onChange,
}: SelectControlProps< T > ) {
	const items = options.map( ( option ) => ( { label: option.label, value: option.value } ) );

	return (
		<UISelectControl
			className="chbe-admin-editor-config__select-control"
			label={ label }
			items={ items }
			value={ items.find( ( item ) => item.value === value ) ?? null }
			onValueChange={ ( item ) => item && onChange( item.value as T ) }
		/>
	);
}
