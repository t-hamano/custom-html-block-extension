/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import {
	__experimentalRadioGroup as RadioGroup,
	__experimentalRadio as Radio,
} from '@wordpress/components';

const Mode = ( { editorMode, setEditorMode } ) => {
	const handleChange = ( value ) => {
		setEditorMode( value );
	};

	return (
		<RadioGroup
			className="chbe-mode"
			label={ __( 'Mode', 'custom-html-block-extension' ) }
			onChange={ handleChange }
			checked={ editorMode }
		>
			<Radio value="basic">{ __( 'Basic', 'custom-html-block-extension' ) }</Radio>
			<Radio value="advanced">{ __( 'Advanced', 'custom-html-block-extension' ) }</Radio>
		</RadioGroup>
	);
};

export default Mode;
