import { Icons } from "@mezon/mobile-components";
import { useTheme } from "@mezon/mobile-ui";
import { selectAllRolesClan, selectMemberClanByUserId, useAppSelector } from "@mezon/store-mobile";
import { MezonAvatar } from "apps/mobile/src/app/temp-ui";
import { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { style } from "./styles";

interface IUserItem {
    userID: string;
    hasBorder?: boolean;
    onPress?: () => void;
}

export default function UserItem({ userID, hasBorder, onPress }: IUserItem) {
    const { themeValue } = useTheme();
    const styles = style(themeValue);
    const user = useAppSelector(selectMemberClanByUserId(userID));
    const rolesClan = useAppSelector(selectAllRolesClan);

    const userRolesClan = useMemo(() => {
        return rolesClan?.filter((role) => {
            if (role.role_user_list?.role_users) {
                const list = role.role_user_list.role_users.filter(user => user.id === userID);
                return list.length;
            }
            return false;
        }) || [];
    }, [userID, rolesClan]);

    const userName = useMemo(() => {
        return user?.user?.username;
    }, [user?.user?.username]);

    const userAvatar = useMemo(() => {
        return user?.user?.avatar_url;
    }, [user?.user?.avatar_url])

    const userDisplay = useMemo(() => {
        return user?.user?.display_name;
    }, [user?.user?.display_name]);

    const onPressUser = useCallback(() => {
        onPress && onPress();
    }, [user?.user?.id])

    return (
        <Pressable onPress={onPressUser}>
            <View style={styles.container}>
                <MezonAvatar
                    avatarUrl={userAvatar}
                    username={userName}
                />
                <View style={[styles.rightContent, hasBorder && styles.border]}>
                    <View style={styles.content}>
                        <Text style={styles.displayName}>{userDisplay}</Text>
                        <Text style={styles.username}>{userName}</Text>

                        <View style={styles.roleWrapper}>
                            {userRolesClan?.length > 0 && userRolesClan.map((role, index) => (
                                <View
                                    key={"role_" + role.title + index.toString()}
                                    style={styles.roleContainer}>
                                    <View style={styles.roleCircle}></View>
                                    <Text style={styles.roleTitle}>{role.title}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.icon}>
                        <Icons.ChevronSmallRightIcon color={themeValue.text} height={20} width={20} />
                    </View>
                </View>
            </View>
        </Pressable>

    )
}