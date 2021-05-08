/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components';

const Loading = () => {
	return (
		<div className="chbe-loading">
			<Spinner />
		</div>
	);
};

export default Loading;
