/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	SearchControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { Stack } from '@wordpress/ui';
import { useDebounce } from '@wordpress/compose';

const MODES = [
	{
		label: __( 'Basic', 'custom-html-block-extension' ),
		value: 'basic',
	},
	{
		label: __( 'Advanced', 'custom-html-block-extension' ),
		value: 'advanced',
	},
] as const;

export type EditorMode = ( typeof MODES )[ number ][ 'value' ];

type FilterProps = {
	editorMode: EditorMode;
	setEditorMode: ( mode: EditorMode ) => void;
	searchQuery: string;
	setSearchQuery: ( query: string ) => void;
};

export default function Filter( {
	editorMode,
	setEditorMode,
	searchQuery,
	setSearchQuery,
}: FilterProps ) {
	const [ searchQueryState, setSearchQueryState ] = useState( searchQuery );

	const debouncedOnChangeSearchQuery = useDebounce( setSearchQuery, 100 );

	return (
		<Stack className="chbe-admin-editor-config-filter" gap="sm">
			<div style={ { flex: 1 } }>
				<ToggleGroupControl
					size="__unstable-large"
					label={ __( 'Mode', 'custom-html-block-extension' ) }
					value={ editorMode }
					onChange={ ( value ) => setEditorMode( value as EditorMode ) }
					isBlock
					hideLabelFromVision
				>
					{ MODES.map( ( mode ) => (
						<ToggleGroupControlOption
							key={ mode.value }
							value={ mode.value }
							label={ mode.label }
							disabled={ !! searchQuery }
						/>
					) ) }
				</ToggleGroupControl>
			</div>
			<div style={ { flex: 1 } }>
				<SearchControl
					value={ searchQueryState }
					onChange={ ( value ) => {
						setSearchQueryState( value );
						debouncedOnChangeSearchQuery( value );
					} }
				/>
			</div>
		</Stack>
	);
}
