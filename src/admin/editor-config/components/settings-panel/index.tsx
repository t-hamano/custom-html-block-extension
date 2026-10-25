/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import { createContext, useContext, useState } from '@wordpress/element';
import { Card, CollapsibleCard, Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { EditorConfigContext } from '../../index';

// Title of the panel a setting is rendered in, such as "Minimap". Undefined
// in the Basic mode.
export const SettingsPanelContext = createContext< string | undefined >( undefined );

// Collapsible panel, forced open while a search query is active and otherwise
// toggled by the user.
export default function SettingsPanel( {
	title,
	children,
}: {
	title: string;
	children: ReactNode;
} ) {
	const { searchQuery } = useContext( EditorConfigContext );
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<CollapsibleCard.Root
			className="chbe-admin-editor-config__panel"
			open={ !! searchQuery || isOpen }
			onOpenChange={ setIsOpen }
		>
			<CollapsibleCard.Header render={ <h2 /> }>
				<Card.Title>{ title }</Card.Title>
			</CollapsibleCard.Header>
			<CollapsibleCard.Content>
				<SettingsPanelContext.Provider value={ title }>
					<Stack direction="column" gap="lg">
						{ children }
					</Stack>
				</SettingsPanelContext.Provider>
			</CollapsibleCard.Content>
		</CollapsibleCard.Root>
	);
}
