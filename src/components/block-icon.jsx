/**
 * WordPress dependencies
 */
import { Path, SVG, Polygon } from '@wordpress/components';

const BlockIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M3.8,19.6H1.1v-2.4H0v6h1.1v-2.6h2.7v2.6h1.1v-6H3.8V19.6z M5.7,18.3h1.7v4.9h1.1v-4.9h1.7v-1.1H5.7 C5.7,17.2,5.7,18.3,5.7,18.3z M15.2,17.2l-1.5,2.7l-1.4-2.7h-0.9l-0.8,6h1.1l0.5-4l1.5,2.8l1.5-2.8l0.5,4h1.1l-0.8-6H15.2z M19,22.2 v-5h-1.1v6h3.6v-1H19z" />
		<Polygon points="16.7,0 7,7.8 10,8.5 5.7,15.2 15.7,7.6 12.6,6.8" />
	</SVG>
);

export default BlockIcon;
