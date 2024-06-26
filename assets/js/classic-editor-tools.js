( function ( $ ) {
	$( function () {
		const textarea = $( '#content' );
		const dialog = $( '#chbe-replace-indent-dialog' );

		// Dialog Setup.
		dialog.dialog( {
			dialogClass: 'chbe-dialog',
			bgiframe: true,
			autoOpen: false,
			width: 400,
		} );

		// Open dialog.
		$( '#chbe-replace-indent-button' ).on( 'click', function () {
			dialog.dialog( 'open' );
		} );

		// Change indent.
		$( '#chbe-apply-button' ).on( 'click', function () {
			changeIndent();
			dialog.dialog( 'close' );
		} );

		// Close dialog.
		$( '#chbe-cancel-button' ).on( 'click', function () {
			dialog.dialog( 'close' );
		} );

		// "Insert type" radio change event.
		$( '[name="before_insert_spaces"]' ).on( 'change', function () {
			if ( $( this ).val() === '1' ) {
				$( '#chbe-item-before-tab-size' ).show();
			} else {
				$( '#chbe-item-before-tab-size' ).hide();
			}
			changeButtonStatus();
		} );
		$( '[name="after_insert_spaces"]' ).on( 'change', function () {
			if ( $( this ).val() === '1' ) {
				$( '#chbe-item-after-tab-size' ).show();
			} else {
				$( '#chbe-item-after-tab-size' ).hide();
			}
			changeButtonStatus();
		} );

		// "Indent width" number change event.
		$( '[name="before_tab_size"], [name="after_tab_size"]' ).on( 'change', function () {
			const value = $( this ).val();
			$( this ).val( value ? toNumber( value, 1, 8 ) : '' );
			changeButtonStatus();
		} );

		// Change indent.
		function changeIndent() {
			const lines = textarea.val().split( '\n' );
			let newLines = '';

			const beforeInsertSpaces = $( '[name="before_insert_spaces"]:checked' ).val();
			const afterInsertSpaces = $( '[name="after_insert_spaces"]:checked' ).val();
			const beforeTabSize = $( '[name="before_tab_size"]' ).val();
			const afterTabSize = $( '[name="after_tab_size"]' ).val();

			for ( let i = 0; i < lines.length; i++ ) {
				let spaces, indentCount, searchValue, newValue;

				if ( beforeInsertSpaces === '1' ) {
					// From space indent
					spaces = lines[ i ].match( /^\s*/ )[ 0 ].length;
					indentCount = Math.floor( spaces / beforeTabSize );
					searchValue = '\x20'.repeat( beforeTabSize * indentCount );

					if ( afterInsertSpaces === '1' ) {
						// To space indent
						newValue = '\x20'.repeat( afterTabSize * indentCount );
					} else {
						// To tab indent
						newValue = '\t'.repeat( indentCount );
					}
				} else {
					// From tab indent
					spaces = lines[ i ].match( /^\t*/ )[ 0 ].length;
					searchValue = '\t'.repeat( spaces );

					if ( afterInsertSpaces === '1' ) {
						// To space indent
						newValue = '\x20'.repeat( afterTabSize * spaces );
					} else {
						// To tab indent (nothing)
						newValue = searchValue;
					}
				}

				const reg = new RegExp( '^' + searchValue );
				newLines += lines[ i ].replace( reg, newValue ) + ( i !== lines.length - 1 ? '\n' : '' );
			}

			textarea.value = newLines;
			window.editor.getModel().setValue( newLines );

			$( '[name="before_insert_spaces"]' ).val( [ afterInsertSpaces ] );
			$( '[name="before_tab_size"]' ).val( afterTabSize );

			if ( afterInsertSpaces === '1' ) {
				$( '#chbe-item-before-tab-size' ).show();
			} else {
				$( '#chbe-item-before-tab-size' ).hide();
			}
		}

		// Change active state of the apply button depending on whether settings is correct or not.
		function changeButtonStatus() {
			const isDisabled =
				( $( '[name="before_insert_spaces"]:checked' ).val() === '1' &&
					$( '[name="before_tab_size"]' ).val() === '' ) ||
				( $( '[name="after_insert_spaces"]:checked' ).val() === '1' &&
					$( '[name="after_tab_size"]' ).val() === '' );
			$( '#chbe-apply-button' ).attr( 'disabled', isDisabled );
		}

		function toNumber( value, min = 0, max = null ) {
			value = Number( value );

			if ( isNaN( value ) || value < min ) {
				value = min;
			}

			if ( null !== max && value > max ) {
				value = max;
			}

			return value;
		}
	} );
} )( jQuery );
