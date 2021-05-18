/**
 * Internal dependencies
 */
import ExportEditorConfig from 'admin/tools/export-editor-config/';
import ImportEditorConfig from 'admin/tools/import-editor-config/';

/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';

const Tools = () => {
	return (
		<>
			<ExportEditorConfig />
			<ImportEditorConfig />
		</>
	);
};

export default Tools;
