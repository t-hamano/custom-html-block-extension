/**
 * Remove commented lines in the source map URL from Monaco Editor core files.
 */

const path = require( 'path' );
const fs = require( 'fs' );

function deleteMaps( dir ) {
	fs.readdir( dir, function ( dirError, files ) {
		files.forEach( ( file ) => {
			const target = path.join( dir, file );
			const stats = fs.statSync( target );

			if ( stats.isDirectory() ) {
				deleteMaps( target );
			} else {
				const extname = path.extname( target );

				if ( extname === '.js' ) {
					fs.readFile( target, 'utf8', ( fileError, data ) => {
						const lines = data.split( '\n' );
						const lastLine = lines[ lines.length - 1 ];
						const hasSourceMappingLine =
							lastLine.includes( 'sourceMappingURL' ) && lines.length > 1;

						if ( hasSourceMappingLine ) {
							fs.writeFileSync( target, lines.slice( 0, lines.length - 1 ).join( '\n' ) );
						}
					} );
				}
			}
		} );
	} );
}

[ './build/lib/' ].map( deleteMaps );
