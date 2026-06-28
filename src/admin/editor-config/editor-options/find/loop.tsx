/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function FindLoop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Loop', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			find: {
				...editorOptions.find,
				loop: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl
					label={ title }
					checked={ editorOptions.find.loop }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					description={ __(
						'Automatically restart the search from the beginning (or end) when no more matches are found.',
						'custom-html-block-extension'
					) }
					isToggle
					defaultToggle
					image="editor-options/find/loop.gif"
					value={ editorOptions.find.loop }
				/>
			</HStack>
		</div>
	);
}
