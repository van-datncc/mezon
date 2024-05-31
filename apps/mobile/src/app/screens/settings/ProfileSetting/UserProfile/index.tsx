import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BannerAvatar, { IFile } from "./components/Banner";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { HashSignIcon } from "@mezon/mobile-components";
import styles from "./styles";
import DetailInfo from "./components/Info";
import { useState } from "react";
import { useAccount, useAuth } from "@mezon/core";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { handleUploadFileMobile, useMezon } from "@mezon/transport";
import { useSelector } from "react-redux";
import { selectCurrentChannelId, selectCurrentClanId } from "@mezon/store";

interface IUserProfile {
    trigger: number;
}

export default function UserProfile({ trigger }: IUserProfile) {
    const auth = useAuth();
    const { updateUser } = useAccount();
    const { sessionRef, clientRef } = useMezon();
    const currentClanId = useSelector(selectCurrentClanId) || '';
    const currentChannelId = useSelector(selectCurrentChannelId) || '';

    const [avatar, setAvatar] = useState<string>(auth.userProfile.user.avatar_url);
    const [displayName, setDisplayName] = useState<string>(auth.userProfile.user.display_name);
    const [username, setUsername] = useState<string>(auth.userProfile.user.username);
    const [bio, setBio] = useState<string>(auth.userProfile.user.about_me);
    const [file, setFile] = useState<IFile>(null);

    function handleAvatarChange(data: IFile) {
        setAvatar(data.uri);
        setFile(data);
    }

    function handleDetailChange({ displayName, username, bio }: { displayName: string, username: string, bio: string }) {
        setDisplayName(displayName);
        setUsername(username);
        setBio(bio);
    }

    function handleHashtagPress() {
        Toast.show({
            type: "info",
            text1: "Original known as " + auth.userProfile.user.username + '#' + auth.userId
        })
    }

    async function handleImageFile() {
        const session = sessionRef.current;
        const client = clientRef.current;

        if (!file || !client || !session) {
            throw new Error('Client is not initialized');
        }

        const res = await handleUploadFileMobile(
            client, session, file.name, file);

        return res.url
    };

    async function updateUserProfile() {
        const imgUrl = await handleImageFile();
        setAvatar(imgUrl);
        updateUser(username, imgUrl, displayName, bio);
        Toast.show({
            type: "info",
            text1: "Update profile success"
        })
    }

    useEffect(() => {
        if (trigger) {
            updateUserProfile()
        }
    }, [trigger])

    return (
        <View style={styles.container}>
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
        </View>
    )
}