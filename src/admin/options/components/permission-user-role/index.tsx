/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Card, CollapsibleCard, Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';

export default function PermissionUserRole() {
	const { options, setOptions } = useContext( AdminContext );

	const userRoles = window.chbeObj.userRoles || [];

	const onChange = ( role: string ) => {
		const newPermissionRoles = options.permissionRoles.includes( role )
			? options.permissionRoles.filter( ( item ) => item !== role )
			: [ ...options.permissionRoles, role ];

		const newOptions = {
			...options,
			permissionRoles: newPermissionRoles,
		};

		setOptions( newOptions );
	};

	return (
		<CollapsibleCard.Root defaultOpen>
			<CollapsibleCard.Header render={ <h2 /> }>
				<Card.Title>
					{ __( 'User roles allowed to use this extension', 'custom-html-block-extension' ) }
				</Card.Title>
			</CollapsibleCard.Header>
			<CollapsibleCard.Content>
				<Stack direction="column" gap="lg">
					{ userRoles.map( ( role, index ) => (
						<SwitchControl
							key={ index }
							label={ role.label }
							checked={ options.permissionRoles.includes( role.value ) }
							onCheckedChange={ () => onChange( role.value ) }
						/>
					) ) }
				</Stack>
			</CollapsibleCard.Content>
		</CollapsibleCard.Root>
	);
}
