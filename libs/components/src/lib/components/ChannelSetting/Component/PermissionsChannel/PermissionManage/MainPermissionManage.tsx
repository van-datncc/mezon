import { permissionRoleChannelActions, selectAllPermissionRoleChannel, selectAllRolesClan, selectAllUsesClan, selectRolesByChannelId, useAppDispatch } from "@mezon/store";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ListPermission, { ListPermissionHandle } from "./ListPermission";
import ListRoleMember from "./ListRoleMember";
import ModalAskChangeChannel from "../../Modal/modalAskChangeChannel";
import { ApiPermissionUpdate } from "mezon-js/api.gen";

const MainPermissionManage = ({ channelID }: { channelID: string }) => {
    const [permissions, setPermissions] = useState<{ [key: string]: number }>({});
    const [currentRoleId, setCurrentRoleId] = useState<string>();
    const listPermissionRoleChannel = useSelector(selectAllPermissionRoleChannel);
    const RolesClan = useSelector(selectAllRolesClan);
    const RolesInChannel = useSelector(selectRolesByChannelId(channelID));
    const dispatch = useAppDispatch();
    const RolesNotInChannel = useMemo(
        () => RolesClan.filter((role) => !RolesInChannel.map((roleInChannel) => roleInChannel.id).includes(role.id)),
        [RolesClan, RolesInChannel]
    );

    const usersClan = useSelector(selectAllUsesClan);

    const listPermissionRef = useRef<ListPermissionHandle>(null);

    const handleSelect = (id: string, option: number, active?: boolean) => {
        const matchingRoleChannel = listPermissionRoleChannel.find((roleChannel) => roleChannel.permission_id === id);

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
                    [id]: option,
                }));
            }
        } else {
            if (matchingRoleChannel) {
                setPermissions((prevPermissions) => ({
                    ...prevPermissions,
                    [id]: option,
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

    const handleSave = async () => {
        setPermissions({});
        const permissionsArray: ApiPermissionUpdate[] = Object.entries(permissions).map(([permission_id, type]) => ({
            permission_id,
            type,
        }));
        await dispatch(permissionRoleChannelActions.setPermissionRoleChannel({channelId: channelID, roleId: currentRoleId || "", permission: permissionsArray}));
    };

    return (
        <>
            <div className="flex mt-4 gap-x-4">
                <ListRoleMember
                    listManageInChannel={RolesInChannel}
                    listManageNotInChannel={RolesNotInChannel}
                    usersClan={usersClan}
                    channelId={channelID}
                    onSelect={handleSelectRole}
                    canChange={Object.keys(permissions).length === 0}
                />
                <ListPermission onSelect={handleSelect} ref={listPermissionRef}/>
            </div>
            <div>
                {Object.keys(permissions).length !== 0 && (
                    <ModalAskChangeChannel onReset={handleReset} onSave={handleSave} className="relative mt-8 bg-transparent pr-0" />
                )}
            </div>
        </>
    );
};

export default MainPermissionManage;