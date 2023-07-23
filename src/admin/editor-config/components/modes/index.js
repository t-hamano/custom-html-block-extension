/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ButtonGroup, Button } from '@wordpress/components';

const MODES = [
	{
		label: __( 'Basic', 'custom-html-block-extension' ),
		value: 'basic',
	},
	{
		label: __( 'Advanced', 'custom-html-block-extension' ),
		value: 'advanced',
	},
];

export default function Modes( { editorMode, setEditorMode } ) {
	const onChangeMode = ( mode ) => {
		setEditorMode( mode );
	};

	return (
		<ButtonGroup
			aria-label={ __( 'Mode', 'custom-html-block-extension' ) }
			className="chbe-admin-editor-config-modes"
			onChange={ setEditorMode }
			checked={ editorMode }
		>
			{ MODES.map( ( mode, index ) => (
				<Button
					key={ index }
					value={ mode.value }
					variant={ editorMode === mode.value ? 'primary' : 'secondary' }
					onClick={ () => onChangeMode( mode.value ) }
				>
					{ mode.label }
				</Button>
			) ) }
		</ButtonGroup>
	);
}
