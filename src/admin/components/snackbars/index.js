/**
 * WordPress dependencies
 */
import { SnackbarList } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

// Last three notices. Slices from the tail end of the list.
const MAX_VISIBLE_NOTICES = -3;

export default function Snackbars() {
	const notices = useSelect( ( select ) => select( noticesStore ).getNotices(), [] );
	const { removeNotice } = useDispatch( noticesStore );
	const filteredNotices = notices.slice( MAX_VISIBLE_NOTICES );

	return (
		<SnackbarList
			notices={ filteredNotices }
			className="chbe-admin-snackbars"
			onRemove={ removeNotice }
		/>
	);
}
