/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';
import { selectSetting } from '../components/setting-item/helpers';

export default function FoldingStrategy() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'foldingStrategy' ] ) => {
		setEditorOptions( {
			...editorOptions,
			foldingStrategy: value,
		} );
	};

	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Folding Strategy', 'custom-html-block-extension' ),
				value: editorOptions.foldingStrategy,
				onChange,
				defaultValue: 'auto',
				options: [
					{
						label: __( 'Depends on the language', 'custom-html-block-extension' ),
						value: 'auto',
						image: 'editor-options/folding-strategy_1.gif',
						description: __(
							'Use a language-specific folding strategy if available, else the indentation-based one.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Depends on indentation', 'custom-html-block-extension' ),
						value: 'indentation',
						image: 'editor-options/folding-strategy_2.gif',
						description: __(
							'Use the indentation-based folding strategy.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls the strategy for computing folding ranges.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ) }
		/>
	);
}
