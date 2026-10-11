/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { InputControl, Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function FontLigatures() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable font ligatures', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const { fontLigatures } = editorOptions;

	const onChange = ( value: boolean ) => {
		// Keep custom font feature settings when ligatures are already enabled.
		if ( value && false !== fontLigatures ) {
			return;
		}
		setEditorOptions( {
			...editorOptions,
			fontLigatures: value,
		} );
	};

	// An empty value enables only the default ligatures, so store `true`
	// rather than an empty string, which monaco treats as disabled.
	const onChangeFeatureSettings = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			fontLigatures: value.trim() ? value : true,
		} );
	};

	return (
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<Stack direction="column" align="start" gap="sm" style={ { width: '100%', maxWidth: 340 } }>
				<SwitchControl
					label={ title }
					checked={ false !== fontLigatures }
					onCheckedChange={ onChange }
				/>
				{ false !== fontLigatures && (
					<div style={ { width: '100%' } }>
						<InputControl
							label={ __( 'Font feature settings', 'custom-html-block-extension' ) }
							description={ __(
								'Value of the CSS font-feature-settings property. Leave empty to use the default ligatures.',
								'custom-html-block-extension'
							) }
							placeholder={ `"ss01", "ss02"` }
							value={ 'string' === typeof fontLigatures ? fontLigatures : '' }
							onValueChange={ onChangeFeatureSettings }
						/>
					</div>
				) }
			</Stack>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Ligatures are special characters in a font that combine two or more characters into one. Only Fira Code font supports ligatures.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/font-ligatures_1.jpg',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/font-ligatures_2.jpg',
						isDefault: true,
					},
				] }
				value={ false !== fontLigatures }
			/>
		</Stack>
	);
}
