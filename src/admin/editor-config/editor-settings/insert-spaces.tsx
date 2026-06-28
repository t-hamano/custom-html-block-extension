/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import {
	__experimentalHStack as HStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';

export default function InsertSpaces() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const title = __( 'Indent type', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Tab', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_1.gif',
			value: 'tab',
		},
		{
			label: __( 'Space', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_2.gif',
			value: 'space',
		},
	];

	const onChange = ( value: string | number | undefined ) => {
		setEditorSettings( {
			...editorSettings,
			insertSpaces: value === 'space',
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack>
				<ToggleGroupControl
					size="__unstable-large"
					label={ __( 'Indent type', 'custom-html-block-extension' ) }
					value={ editorSettings.insertSpaces ? 'space' : 'tab' }
					onChange={ onChange }
					isBlock
				>
					{ items.map( ( item ) => (
						<ToggleGroupControlOption
							key={ item.value }
							value={ item.value }
							label={ item.label }
						/>
					) ) }
				</ToggleGroupControl>
			</HStack>
		</div>
	);
}
