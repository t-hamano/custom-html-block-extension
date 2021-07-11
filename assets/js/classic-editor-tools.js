( function( $ ) {
$( function() {
	const textarea = $( '#content' );
	const dialog = $( '#chbe-replace-indent-dialog' );

	// Dialog Setup.
	dialog.dialog({
		dialogClass: 'chbe-dialog',
		bgiframe: true,
		autoOpen: false,
		width: 400
	});

	// Open dialog.
	$( '#chbe-replace-indent-button' ).click( function() {
		dialog.dialog( 'open' );
	});

	// Change indent.
	$( '#chbe-apply-button' ).click( function() {
		changeIndent();
		dialog.dialog( 'close' );
	});

	// Close dialog.
	$( '#chbe-cancel-button' ).click( function() {
		$( '#chbe-replace-indent-dialog' ).dialog( 'close' );
	});

	// "Insert type" radio change event.
	$( '[name="before_insert_spaces"]' ).change( function() {
		if ( $( this ).val() === '1' ) {
			$( '#chbe-item-before-tab-size' ).show();
		} else {
			$( '#chbe-item-before-tab-size' ).hide();
		}
	});
	$( '[name="after_insert_spaces"]' ).change( function() {
		if ( $( this ).val() === '1' ) {
			$( '#chbe-item-after-tab-size' ).show();
		} else {
			$( '#chbe-item-after-tab-size' ).hide();
		}
	});

	// Change indent.
	function changeIndent() {
		var lines = $( '#content' ).val().split( '\n' );
		var newLines = '';

		var beforeInsertSpaces = $( '[name="before_insert_spaces"]:checked' ).val();
		var afterInsertSpaces = $( '[name="after_insert_spaces"]:checked' ).val();
		var beforeTabSize = $( '[name="before_tab_size"]' ).val();
		var afterTabSize = $( '[name="after_tab_size"]' ).val();

		for ( var i = 0; i < lines.length; i++ ) {
			var spaces, indentCount, searchValue, newValue;

			if ( beforeInsertSpaces === '1' ) {
				// From space indent
				spaces = lines[i].match( /^\s*/ )[0].length;
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
				spaces = lines[i].match( /^\t*/ )[0].length;
				searchValue = '\t'.repeat( spaces );

				if ( afterInsertSpaces === '1' ) {
					// To space indent
					newValue = '\x20'.repeat( afterTabSize * spaces );
				} else {
					// To tab indent (nothing)
					newValue = searchValue;
				}
			}

			let reg = new RegExp( '^' + searchValue  );
			newLines += lines[i].replace( reg, newValue ) + ( i != lines.length - 1 ? '\n' : '' );
		}

		textarea.value = newLines;
		window.editor.getModel().setValue( newLines );

		$( '[name="before_insert_spaces"]' ).val( [afterInsertSpaces] );
		$( '[name="before_tab_size"]' ).val( afterTabSize );

		if ( afterInsertSpaces === '1' ) {
			$( '#chbe-item-before-tab-size' ).show();
		} else {
			$( '#chbe-item-before-tab-size' ).hide();
		}
	};
});
}( jQuery ) );
