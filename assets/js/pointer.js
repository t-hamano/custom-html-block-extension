( function( $ ) {
$( function() {
	if ( window.chbePointer ) {
		$( '#menu-settings .wp-has-submenu' ).pointer({
			content: chbePointer.content,
			position: { 'edge': 'left', 'align': 'center' },
			close: function() {
				$.post( 'admin-ajax.php', {
					action: 'dismiss-wp-pointer',
					pointer: chbePointer.name
				});
			}
		}).pointer( 'open' );
	}
});
}( jQuery ) );
