/**
 * External dependencies
 */
import type { ReactNode } from 'react';

// Wrapper for settings that depend on another setting. While searching, it is
// hidden by CSS when none of its settings match the search query.
export default function SettingGroup( {
	isDisabled,
	children,
}: {
	isDisabled: boolean;
	children: ReactNode;
} ) {
	return (
		<div className="chbe-admin-editor-config__setting-group" inert={ isDisabled ? '' : undefined }>
			{ children }
		</div>
	);
}
