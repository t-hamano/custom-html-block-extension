export const toNumber = ( value, min = 0, max = null ) => {
	value = Number( value );

	if ( isNaN( value ) || value < min ) {
		value = min;
	}

	if ( null !== max && value > max ) {
		value = max;
	}

	return value;
};

export const rTabs = ( str ) => {
	str = str.trim();

	if ( chbeObj.editorSettings.insertSpaces ) {
		str = str.replace( /\t/gm, ' '.repeat( chbeObj.editorSettings.tabSize ) );
	}

	return str;
};
