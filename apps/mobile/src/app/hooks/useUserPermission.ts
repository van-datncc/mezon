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
    isClanOwner
  }
}