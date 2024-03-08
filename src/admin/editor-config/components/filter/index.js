/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { ButtonGroup, Button, SearchControl } from '@wordpress/components';
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
];

export default function Filter( { editorMode, setEditorMode, searchQuery, setSearchQuery } ) {
	const [ searchQueryState, setSearchQueryState ] = useState( searchQuery );

	const onChangeMode = ( mode ) => {
		setEditorMode( mode );
	};

	const debouncedOnChangeSearchQuery = useDebounce( ( value ) => {
		setSearchQuery( value );
	}, 100 );

	useEffect( () => {
		debouncedOnChangeSearchQuery( searchQueryState );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ searchQueryState ] );

	return (
		<div className="chbe-admin-editor-config-filter">
			<ButtonGroup
				className="chbe-admin-editor-config-filter__mode"
				aria-label={ __( 'Mode', 'custom-html-block-extension' ) }
				onChange={ setEditorMode }
				checked={ editorMode }
			>
				{ MODES.map( ( mode, index ) => (
					<Button
						key={ index }
						value={ mode.value }
						variant={ editorMode === mode.value ? 'primary' : 'secondary' }
						onClick={ () => onChangeMode( mode.value ) }
						disabled={ searchQuery }
						__next40pxDefaultSize
					>
						{ mode.label }
					</Button>
				) ) }
			</ButtonGroup>
			<SearchControl
				className="chbe-admin-editor-config-filter__search"
				value={ searchQueryState }
				onChange={ setSearchQueryState }
			/>
		</div>
	);
}
