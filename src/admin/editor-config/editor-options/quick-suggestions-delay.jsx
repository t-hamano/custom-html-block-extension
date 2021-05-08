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

const QuickSuggestionsDelay = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			quickSuggestionsDelay: value ? toNumber( value, 0, 1000 ) : 10
		});
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Time until suggestions are displayed (ms)', 'custom-html-block-extension' ) }
				value={ editorOptions.quickSuggestionsDelay }
				min="0"
				max="1000"
				allowReset
				onChange={ ( value ) => handleChange( value ) }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Time until suggestions are displayed (ms)', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ sprintf( __( 'Example: Set the value to %s', 'custom-html-block-extension' ), 0 ) }</h3>
							<img
								src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/quick-suggestions-delay_1.gif' }
								alt={ sprintf( __( 'Example: Set the value to %s', 'custom-html-block-extension' ), 0 ) }
							/>
						</div>
						<div className="chbe-modal__col">
							<h3>{ sprintf( __( 'Example: Set the value to %s', 'custom-html-block-extension' ), 1000 ) }</h3>
							<img
								src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/quick-suggestions-delay_2.gif' }
								alt={ sprintf( __( 'Example: Set the value to %s', 'custom-html-block-extension' ), 1000 ) }
							/>
						</div>
					</div>
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

export default QuickSuggestionsDelay;
