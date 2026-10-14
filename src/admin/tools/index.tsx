/**
 * WordPress dependencies
 */
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import ExportTool from './components/export-tool';
import ImportTool from './components/import-tool';
import VSCodeImportTool from './components/vscode-import-tool';

export default function Tools() {
	return (
		<Stack direction="column" gap="lg">
			<ExportTool />
			<ImportTool />
			<VSCodeImportTool />
		</Stack>
	);
}
