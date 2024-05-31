import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BannerAvatar from "./components/Banner";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { HashSignIcon } from "@mezon/mobile-components";
import styles from "./styles";
import DetailInfo from "./components/Info";
import { useState } from "react";
import { useAccount, useAuth } from "@mezon/core";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

interface IUserProfile {
    trigger: number;
}

export default function UserProfile({ trigger }: IUserProfile) {
    const auth = useAuth();
    const { updateUser } = useAccount();

    const [avatar, setAvatar] = useState<string>(auth.userProfile.user.avatar_url);
    const [displayName, setDisplayName] = useState<string>(auth.userProfile.user.display_name);
    const [username, setUsername] = useState<string>(auth.userProfile.user.username);
    const [bio, setBio] = useState<string>();

    function handleAvatarChange(url: string) {
        setAvatar(url);
    }

    function handleDetailChange({ displayName, username, bio }: { displayName: string, username: string, bio: string }) {
        setDisplayName(displayName);
        setUsername(username);
        setBio(bio);
    }

    function handleHashtagPress(){
        Toast.show({
            type: "info",
            text1: "Original known as " + auth.userProfile.user.username + '#' + auth.userId
        })
    }

    async function updateUserProfile() {
        // updateUser(name, avatar, displayName, editAboutUser);
    }

    useEffect(() => {
        updateUserProfile
    }, [trigger])

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BannerAvatar
                avatar={avatar}
                onChange={handleAvatarChange} />

            <View style={styles.btnGroup}>
                <View style={styles.btnIcon}>
                    <TouchableOpacity onPress={handleHashtagPress}>
                        <HashSignIcon width={16} height={16} />
                    </TouchableOpacity>
                </View>
            </View>
            <DetailInfo
                value={{ displayName, username, bio }}
                onChange={handleDetailChange}
            />
        </ScrollView>
    )
}