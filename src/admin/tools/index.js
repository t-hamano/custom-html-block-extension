/**
 * WordPress dependencies
 */
import { __experimentalVStack as VStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ExportTool from './components/export-tool';
import ImportTool from './components/import-tool';

export default function Tools() {
	return (
		<VStack spacing={ 4 }>
			<ExportTool />
			<ImportTool />
		</VStack>
	);
}
