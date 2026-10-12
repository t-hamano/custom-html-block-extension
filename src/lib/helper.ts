// Round values to the specified minimum and maximum values.
export const toNumber = ( value: string | number, min = 0, max: number | null = null ): number => {
	let num = Number( value );

	if ( isNaN( num ) || num < min ) {
		num = min;
	}

	if ( null !== max && num > max ) {
		num = max;
	}

	return num;
};

// Whether two JSON-compatible values are deeply equal, regardless of key order.
export const isDeepEqual = ( a: unknown, b: unknown ): boolean => {
	if ( a === b ) {
		return true;
	}

	if ( typeof a !== 'object' || typeof b !== 'object' || null === a || null === b ) {
		return false;
	}

	if ( Array.isArray( a ) !== Array.isArray( b ) ) {
		return false;
	}

	const aRecord = a as Record< string, unknown >;
	const bRecord = b as Record< string, unknown >;
	const aKeys = Object.keys( aRecord );
	const bKeys = Object.keys( bRecord );

	if ( aKeys.length !== bKeys.length ) {
		return false;
	}

	return aKeys.every(
		( key ) =>
			Object.prototype.hasOwnProperty.call( bRecord, key ) &&
			isDeepEqual( aRecord[ key ], bRecord[ key ] )
	);
};

// Monaco's outline of HTML is flat, so the default `outlineModel` pins no lines.
export const withStickyScrollModel = < T extends { stickyScroll?: object } >( options: T ) => ( {
	...options,
	stickyScroll: {
		...options.stickyScroll,
		defaultModel: 'foldingProviderModel' as const,
	},
} );
