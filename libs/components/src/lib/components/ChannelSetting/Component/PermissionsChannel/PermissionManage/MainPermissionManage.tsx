import {
	permissionRoleChannelActions,
	selectAllPermissionRoleChannel,
	selectAllRolesClan,
	selectAllUsesClan,
	selectRolesByChannelId,
	useAppDispatch
} from '@mezon/store';
import { EPermissionId, EVERYONE_ROLE_ID } from '@mezon/utils';
import { ApiPermissionUpdate } from 'mezon-js/api.gen';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { TypeChoose } from './ItemPermission';
import ListPermission, { ListPermissionHandle } from './ListPermission';
import ListRoleMember from './ListRoleMember';

type MainPermissionManageProps = {
	channelId: string;
	setIsShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
	setPermissionsListHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
	saveTriggerRef: React.MutableRefObject<(() => void) | null>;
	resetTriggerRef: React.MutableRefObject<(() => void) | null>;
};

const MainPermissionManage: React.FC<MainPermissionManageProps> = ({
	channelId,
	setIsShowSaveButton,
	setPermissionsListHasChanged,
	saveTriggerRef,
	resetTriggerRef
}) => {
	const [permissions, setPermissions] = useState<{ [key: string]: number }>({});
	const [currentRoleId, setCurrentRoleId] = useState<string>(EVERYONE_ROLE_ID);
	const listPermissionRoleChannel = useSelector(selectAllPermissionRoleChannel);
	const RolesClan = useSelector(selectAllRolesClan);
	const RolesInChannel = useSelector(selectRolesByChannelId(channelId));
	const dispatch = useAppDispatch();
	const RolesNotInChannel = useMemo(
		() => RolesClan.filter((role) => !RolesInChannel.map((roleInChannel) => roleInChannel.id).includes(role.id)),
		[RolesClan, RolesInChannel]
	);
	const usersClan = useSelector(selectAllUsesClan);

	const listPermissionRef = useRef<ListPermissionHandle>(null);

	const handleSelect = (id: string, option: number, active?: boolean) => {
		const matchingRoleChannel = listPermissionRoleChannel.find((roleChannel) => roleChannel.permission_id === id);

		if (id === EPermissionId.VIEW_CHANNEL && currentRoleId === EVERYONE_ROLE_ID) {
			if (option === TypeChoose.Remove) {
				setIsShowSaveButton(true);
			} else {
				setIsShowSaveButton(false);
			}
		}

		if (active !== undefined) {
			if (matchingRoleChannel && matchingRoleChannel.active === active) {
				if (permissions[id] !== undefined) {
					const { [id]: _, ...rest } = permissions;
					setPermissions(rest);
				}
				return;
			} else {
				setPermissions((prevPermissions) => ({
					...prevPermissions,
					[id]: option
				}));
			}
		} else {
			if (matchingRoleChannel) {
				setPermissions((prevPermissions) => ({
					...prevPermissions,
					[id]: option
				}));
			} else {
				const { [id]: _, ...rest } = permissions;
				setPermissions(rest);
			}
		}
	};

	const handleSelectRole = (id: string) => {
		setCurrentRoleId(id);
	};

	const handleReset = () => {
		setPermissions({});
		listPermissionRef.current?.reset();
	};

	resetTriggerRef.current = handleReset;

	const handleSave = async (roleId: string, permissionsArray: ApiPermissionUpdate[]) => {
		setPermissions({});
		await dispatch(
			permissionRoleChannelActions.setPermissionRoleChannel({ channelId: channelId, roleId: roleId || '', permission: permissionsArray })
		);
	};

	useEffect(() => {
		const hasPermissionsListChanged = Object.keys(permissions).length !== 0;
		setPermissionsListHasChanged(hasPermissionsListChanged);
	}, [Object.keys(permissions).length]);

	useEffect(() => {
		const permissionsArray: ApiPermissionUpdate[] = Object.entries(permissions).map(([permission_id, type]) => ({
			permission_id,
			type
		}));
		saveTriggerRef.current = async () => {
			await handleSave(currentRoleId || '', permissionsArray);
		};
	}, [Object.keys(permissions).length, currentRoleId]);

	return (
		<div className="flex mt-4 gap-x-4">
			<ListRoleMember
				listManageInChannel={RolesInChannel}
				listManageNotInChannel={RolesNotInChannel}
				usersClan={usersClan}
				channelId={channelId}
				onSelect={handleSelectRole}
				canChange={Object.keys(permissions).length === 0}
			/>
			<ListPermission onSelect={handleSelect} ref={listPermissionRef} />
		</div>
	);
};

export default MainPermissionManage;
