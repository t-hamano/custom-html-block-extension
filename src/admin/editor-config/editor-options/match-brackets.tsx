/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function MatchBrackets() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Highlight matching brackets', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always', 'custom-html-block-extension' ),
			value: 'always',
			isDefault: true,
			image: 'editor-options/match-brackets_1.gif',
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/match-brackets_2.gif',
		},
		{
			label: __( 'Only when the cursor is near the bracket', 'custom-html-block-extension' ),
			value: 'near',
			image: 'editor-options/match-brackets_3.gif',
		},
	];

	const onChange = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			matchBrackets: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ editorOptions.matchBrackets }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					colCount="3"
					value={ editorOptions.matchBrackets }
				/>
			</HStack>
		</div>
	);
}
