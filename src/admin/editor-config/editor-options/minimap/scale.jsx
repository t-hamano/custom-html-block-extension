/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'admin/common/helper';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import {
	PanelRow,
	RangeControl,
	Button,
	Modal
} from '@wordpress/components';

const Scale = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				scale: value ? toNumber( value, 1, 3 ) : 1
			}
		});
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Scale', 'custom-html-block-extension' ) }
				value={ editorOptions.minimap.scale }
				min="1"
				max="3"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Scale', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<img
						src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/scale.gif' }
						alt={ __( 'Scale', 'custom-html-block-extension' ) }
					/>
				</Modal>
			)}
			<Button
				className="chbe-help"
				icon={ info }
				label={ __( 'Information', 'custom-html-block-extension' ) }
				onClick={ () => setIsModalOpen( true ) }
			></Button>
		</PanelRow>
	);
};

export default Scale;
