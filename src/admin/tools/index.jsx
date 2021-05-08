/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';

const Tools = () => {
	return (
		<div className="chbe-tools">
			<p>{ __( 'I\'m planning to add some features in future versions. For example, the ability to import/export settings.', 'custom-html-block-extension' ) }</p>
			<p>{ __( 'Please contact us via the project page if you have any requests or comments.', 'custom-html-block-extension' ) }</p>
			<p><ExternalLink href={ __( 'https://github.com/t-hamano/custom-html-block-extension', 'custom-html-block-extension' ) }>{ __( 'GitHub Project Page', 'custom-html-block-extension' ) }</ExternalLink></p>
		</div>
	);
};

export default Tools;
