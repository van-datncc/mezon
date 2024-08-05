import { useAuth } from "@mezon/core";
import { selectAllRolesClan, selectCurrentClan, selectMemberByUserId } from "@mezon/store-mobile";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getUserPermissionsStatus } from "../utils/helpers";

export const useUserPermission = () => {
  const { userId, userProfile } = useAuth();
  const userById = useSelector(selectMemberByUserId(userId || ''));
  const currentClan = useSelector(selectCurrentClan);
	const rolesClan = useSelector(selectAllRolesClan);
	const userPermissionsStatus = useMemo(() => {
		return getUserPermissionsStatus(userById?.role_id, rolesClan)
	}, [userById?.role_id, rolesClan])

	const isClanOwner = useMemo(() => {
		return currentClan?.creator_id === userProfile?.user?.id
	}, [currentClan?.creator_id, userProfile?.user?.id])

  return {
    userPermissionsStatus,
    isClanOwner,
    isCanManageThread: userPermissionsStatus["manage-thread"] || userPermissionsStatus.administrator || isClanOwner,
    isCanManageChannel: userPermissionsStatus["manage-channel"] || userPermissionsStatus.administrator || isClanOwner,
    isCanManageClan: userPermissionsStatus["manage-clan"] || userPermissionsStatus.administrator || isClanOwner,
    isCanDeleteMessage: userPermissionsStatus["delete-message"] || userPermissionsStatus.administrator || isClanOwner,
    isCanSendMessage: userPermissionsStatus["send-message"] || userPermissionsStatus.administrator || isClanOwner,
    isCanManageEvent: isClanOwner || userPermissionsStatus.administrator || userPermissionsStatus["manage-clan"]
  }
}