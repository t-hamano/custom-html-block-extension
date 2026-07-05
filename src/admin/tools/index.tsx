/**
 * WordPress dependencies
 */
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import ExportTool from './components/export-tool';
import ImportTool from './components/import-tool';

export default function Tools() {
	return (
		<Stack direction="column" gap="lg">
			<ExportTool />
			<ImportTool />
		</Stack>
	);
}
