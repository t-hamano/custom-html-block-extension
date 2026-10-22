/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { Card, CollapsibleCard, Stack, Text } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { useDebounce } from '@wordpress/compose';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../index';
import { updateSettings } from '../api';
import EditorPreview from './components/editor-preview';
import Filter, { type EditorMode } from './components/filter';
import Controls from './components/controls';
import SettingItem from './components/setting-item';
import { getBasicSettings, getSettingPanels } from './settings';
import { SEARCH_HIGHLIGHT_NAME, SETTING_LABEL_SELECTOR, getSearchPatterns } from './search';
import { isDeepEqual } from '../../lib/helper';
import type { EditorConfigContextType } from '../../types';

/**
 * Context
 */
export const EditorConfigContext = createContext< EditorConfigContextType >(
	{} as EditorConfigContextType
);

// Highlights the words matching the search query in the setting labels.
// The controls only accept a string label, so the CSS Custom Highlight API
// styles the matched text ranges.
function useSearchHighlight( searchQuery: string ) {
	const ref = useRef< HTMLDivElement >( null );

	useEffect( () => {
		const patterns = getSearchPatterns( searchQuery );
		if ( ! ref.current || ! patterns.length || ! ( 'highlights' in CSS ) ) {
			return;
		}

		const ranges: Range[] = [];
		ref.current.querySelectorAll( SETTING_LABEL_SELECTOR ).forEach( ( label ) => {
			const walker = document.createTreeWalker( label, NodeFilter.SHOW_TEXT );
			while ( walker.nextNode() ) {
				const node = walker.currentNode;
				const text = node.textContent ?? '';
				patterns.forEach( ( pattern ) => {
					for ( const match of text.matchAll( pattern ) ) {
						const range = new Range();
						range.setStart( node, match.index );
						range.setEnd( node, match.index + match[ 0 ].length );
						ranges.push( range );
					}
				} );
			}
		} );

		CSS.highlights.set( SEARCH_HIGHLIGHT_NAME, new Highlight( ...ranges ) );

		return () => {
			CSS.highlights.delete( SEARCH_HIGHLIGHT_NAME );
		};
	}, [ searchQuery ] );

	return ref;
}

// Collapsible panel, forced open while a search query is active and otherwise
// toggled by the user.
function SettingsPanel( { title, children }: { title: string; children: ReactNode } ) {
	const { searchQuery } = useContext( EditorConfigContext );
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<CollapsibleCard.Root
			className="chbe-admin-editor-config__panel"
			open={ !! searchQuery || isOpen }
			onOpenChange={ setIsOpen }
		>
			<CollapsibleCard.Header render={ <h2 /> }>
				<Card.Title>{ title }</Card.Title>
			</CollapsibleCard.Header>
			<CollapsibleCard.Content>
				<Stack direction="column" gap="lg">
					{ children }
				</Stack>
			</CollapsibleCard.Content>
		</CollapsibleCard.Root>
	);
}

export default function EditorConfig() {
	const {
		isWaiting,
		editorSettings,
		editorOptions,
		savedEditorConfig,
		setIsWaiting,
		setEditorOptions,
		setEditorSettings,
		setSavedEditorConfig,
	} = useContext( AdminContext );

	const [ isEditorDisabled, setIsEditorDisabled ] = useState( false );
	const [ editorMode, setEditorMode ] = useState< EditorMode >( 'basic' );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const settingsRef = useSearchHighlight( searchQuery );
	const [ fontWeights, setFontWeights ] = useState( [ 300 ] );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	const isDirty =
		! isDeepEqual( editorSettings, savedEditorConfig.editorSettings ) ||
		! isDeepEqual( editorOptions, savedEditorConfig.editorOptions );

	// Update editor config.
	const onUpdateOptions = async () => {
		setIsWaiting( true );

		try {
			await updateSettings( { editorSettings, editorOptions } );
			setSavedEditorConfig( { editorSettings, editorOptions } );
			// Keep the spinner visible briefly so it does not flash on fast responses.
			await new Promise( ( resolve ) => setTimeout( resolve, 600 ) );
			createSuccessNotice( __( 'Settings saved.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
		} catch ( error ) {
			createErrorNotice( ( error as Error ).message, { type: 'snackbar' } );
		} finally {
			setIsWaiting( false );
		}
	};

	// Reset editor config.
	const onResetOptions = async () => {
		setIsWaiting( true );

		try {
			const response = await updateSettings( { editorSettings: null, editorOptions: null } );
			// Sets default editor config.
			setEditorSettings( response.editorSettings );
			setEditorOptions( response.editorOptions );
			setSavedEditorConfig( {
				editorSettings: response.editorSettings,
				editorOptions: response.editorOptions,
			} );
			// Keep the spinner visible briefly so it does not flash on fast responses.
			await new Promise( ( resolve ) => setTimeout( resolve, 600 ) );
			createSuccessNotice( __( 'Settings have been reset.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
		} catch ( error ) {
			createErrorNotice( ( error as Error ).message, { type: 'snackbar' } );
		} finally {
			setIsWaiting( false );
		}
	};

	// Refresh editor.
	// Memoized so consumers can derive stable (debounced) callbacks from it.
	const onRefreshEditor = useCallback( () => {
		// Some options are not reflected when the state is changed.
		// So disable the editor for a moment by Disabled component as a workaround.
		setIsEditorDisabled( true );
		setTimeout( () => {
			setIsEditorDisabled( false );
		}, 300 );
	}, [] );

	// Merge refreshes requested in quick succession, such as while dragging a
	// range control, into one.
	const debouncedRefreshEditor = useDebounce( onRefreshEditor, 100 );

	const editorConfigContext = useMemo(
		() => ( { onRefreshEditor: debouncedRefreshEditor, searchQuery, fontWeights } ),
		[ debouncedRefreshEditor, searchQuery, fontWeights ]
	);

	// The definitions read translations, so create them at render time.
	const panels = useMemo( () => getSettingPanels(), [] );
	const basicSettings = useMemo( () => getBasicSettings( panels ), [ panels ] );

	return (
		<Stack align="start" wrap="wrap" className="chbe-admin-editor-config" gap="xl">
			<Stack direction="column" className="chbe-admin-editor-config__preview" gap="lg">
				<Text variant="heading-lg" render={ <h2 /> }>
					{ __( 'Preview', 'custom-html-block-extension' ) }
				</Text>
				<EditorPreview isEditorDisabled={ isEditorDisabled } setFontWeights={ setFontWeights } />
				<Controls
					isWaiting={ isWaiting }
					isDirty={ isDirty }
					onUpdateOptions={ onUpdateOptions }
					onResetOptions={ onResetOptions }
				/>
			</Stack>
			<Stack direction="column" className="chbe-admin-editor-config__settings" gap="xl">
				<Filter
					editorMode={ editorMode }
					setEditorMode={ setEditorMode }
					searchQuery={ searchQuery }
					setSearchQuery={ setSearchQuery }
				/>
				<Stack
					ref={ settingsRef }
					direction="column"
					className={ clsx(
						editorMode === 'basic' && ! searchQuery
							? 'chbe-admin-editor-config__basic-settings'
							: 'chbe-admin-editor-config__advanced-settings',
						{ 'is-searching': !! searchQuery }
					) }
					gap={ editorMode === 'basic' && ! searchQuery ? 'xl' : 'sm' }
				>
					<EditorConfigContext.Provider value={ editorConfigContext }>
						{ 'basic' === editorMode && ! searchQuery
							? basicSettings.map( ( setting ) => (
									<SettingItem key={ setting.id } setting={ setting } />
								) )
							: panels.map( ( panel ) => (
									<SettingsPanel key={ panel.title } title={ panel.title }>
										{ panel.settings.map( ( setting ) => (
											<SettingItem key={ setting.id } setting={ setting } />
										) ) }
									</SettingsPanel>
								) ) }
					</EditorConfigContext.Provider>
				</Stack>
			</Stack>
		</Stack>
	);
}
