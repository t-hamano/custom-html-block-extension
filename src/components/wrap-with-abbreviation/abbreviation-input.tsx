/**
 * External dependencies
 */
import type { FocusEvent, KeyboardEvent } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { InputControl } from '@wordpress/ui';

type AbbreviationInputProps = {
	onChange: ( abbreviation: string ) => void;
	onConfirm: () => void;
	onCancel: () => void;
	onBlur: ( event: FocusEvent< HTMLInputElement > ) => void;
};

export default function AbbreviationInput( {
	onChange,
	onConfirm,
	onCancel,
	onBlur,
}: AbbreviationInputProps ) {
	const [ abbreviation, setAbbreviation ] = useState( '' );
	const inputRef = useRef< HTMLInputElement >( null );

	useEffect( () => {
		inputRef.current?.focus();
	}, [] );

	const onKeyDown = ( event: KeyboardEvent< HTMLInputElement > ) => {
		// Prevent the block editor from handling the keys, e.g. Escape to deselect the block.
		event.stopPropagation();
		if ( event.nativeEvent.isComposing ) {
			return;
		}
		if ( 'Enter' === event.key ) {
			event.preventDefault();
			onConfirm();
		} else if ( 'Escape' === event.key ) {
			event.preventDefault();
			onCancel();
		}
	};

	return (
		<InputControl
			label={ __( 'Abbreviation', 'custom-html-block-extension' ) }
			hideLabelFromVision
			description={ __(
				"Enter Abbreviation (Press 'Enter' to confirm or 'Escape' to cancel)",
				'custom-html-block-extension'
			) }
			size="compact"
			value={ abbreviation }
			onChange={ ( event ) => {
				setAbbreviation( event.target.value );
				onChange( event.target.value );
			} }
			onKeyDown={ onKeyDown }
			onBlur={ onBlur }
			ref={ inputRef }
			autoComplete="off"
			spellCheck={ false }
		/>
	);
}
