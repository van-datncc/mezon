import { PenIcon } from "@mezon/mobile-components";
import { Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import styles from "./style";
import { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { handleUploadFileMobile, useMezon } from "@mezon/transport";
import { useSelector } from "react-redux";
import { selectCurrentChannel } from "@mezon/store-mobile";
import { useClans } from "@mezon/core";

export interface IFile {
    uri: string;
    name: string;
    type: string;
    size: string;
    fileData: any;
}

interface ILogoClanSelector { }

export default function LogoClanSelector({ }: ILogoClanSelector) {
    const { currentClan, updateClan } = useClans();
    const { sessionRef, clientRef } = useMezon();
    const currentChannel = useSelector(selectCurrentChannel);

    const [clanLogo, setClanLogo] = useState<string>(currentClan.logo);

    async function handleUploadImage(file: IFile) {
        const session = sessionRef.current;
        const client = clientRef.current;

        if (!file || !client || !session) {
            throw new Error('Client is not initialized');
        }
        const ms = new Date().getTime();
        const fullFilename = `${currentClan?.clan_id}/${currentChannel?.channel_id}/${ms}`.replace(/-/g, '_') + '/' + file.name;
        const res = await handleUploadFileMobile(client, session, fullFilename, file);
        return res.url;
    }

    async function handleSelectImage() {
        const response = await launchImageLibrary({
            mediaType: "photo",
            includeBase64: true,
        });

        if (response.didCancel) {
            console.log('User cancelled camera');
        } else if (response.errorCode) {
            console.log('Camera Error: ', response.errorMessage);
        } else {
            const file = response.assets[0];
            return {
                uri: file?.uri,
                name: file?.fileName,
                type: file?.type,
                size: file?.fileSize?.toString(),
                fileData: file?.base64,
            } as IFile;
        }
    }

    async function handleImage() {
        const file = await handleSelectImage();
        if (file) {
            setClanLogo(file.uri);
            const url = await handleUploadImage(file);

            if (url) {
                setClanLogo(url);
                await updateClan({
                    banner: currentClan?.banner ?? '',
                    clan_id: currentClan?.clan_id ?? '',
                    clan_name: currentClan?.clan_name ?? '',
                    creator_id: currentClan?.creator_id ?? '',
                    logo: url || (currentClan?.logo ?? ''),
                });
            }
        }
    }

    return (
        <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
                <TouchableOpacity onPress={handleImage}>
                    <View style={styles.logoWrapper}>
                        <FastImage
                            source={{ uri: clanLogo }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </View>

                    <View style={styles.btnWrapper}>
                        <PenIcon height={12} width={12} color="gray" />
                    </View>
                </TouchableOpacity>
            </View>
            <Text style={styles.clanName}>{currentClan.clan_name}</Text>
        </View>
    )
}