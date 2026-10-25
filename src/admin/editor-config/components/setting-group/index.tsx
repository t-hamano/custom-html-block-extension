/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useContext, useLayoutEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { EditorConfigContext } from '../../index';

// Value for the `inert` attribute; the empty string enables it (React 18 form).
function inertValue( condition: boolean ): '' | undefined {
	return condition ? '' : undefined;
}

// Wrapper for settings that depend on another setting. It is marked as empty
// when none of its settings match the search query, so it takes no space.
export default function SettingGroup( {
	isDisabled,
	children,
}: {
	isDisabled: boolean;
	children: ReactNode;
} ) {
	const { searchQuery } = useContext( EditorConfigContext );
	const ref = useRef< HTMLDivElement >( null );
	const [ isEmpty, setIsEmpty ] = useState( false );

	// The settings decide their own visibility, so check the rendered result.
	useLayoutEffect( () => {
		setIsEmpty( ! ref.current?.querySelector( '.chbe-admin-editor-config__setting-item' ) );
	}, [ searchQuery ] );

	return (
		<div
			ref={ ref }
			className={ clsx( 'chbe-admin-editor-config__setting-group', { 'is-empty': isEmpty } ) }
			inert={ inertValue( isDisabled ) }
		>
			{ children }
		</div>
	);
}
