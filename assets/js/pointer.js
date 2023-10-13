( function ( $ ) {
	$( function () {
		if ( window.chbePointer ) {
			$( '#menu-settings .wp-has-submenu' )
				.pointer( {
					content: window.chbePointer.content,
					position: { edge: 'left', align: 'center' },
					close() {
						$.post( 'admin-ajax.php', {
							action: 'dismiss-wp-pointer',
							pointer: window.chbePointer.name,
						} );
					},
				} )
				.pointer( 'open' );
		}
	} );
} )( jQuery );
