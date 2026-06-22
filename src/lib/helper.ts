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
