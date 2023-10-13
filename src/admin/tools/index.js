/**
 * Internal dependencies
 */
import ExportTool from './components/export-tool';
import ImportTool from './components/import-tool';

export default function Tools() {
	return (
		<div className="chbe-admin-tools">
			<ExportTool />
			<ImportTool />
		</div>
	);
}
