import { Icons } from "@mezon/mobile-components";
import { DimensionValue, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native-gesture-handler";
import { style } from "./styles";
import { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { handleUploadFileMobile, useMezon } from "@mezon/transport";
import { useSelector } from "react-redux";
import { selectCurrentChannel } from "@mezon/store-mobile";
import { memo } from "react";
import { useTheme } from "@mezon/mobile-ui";

export interface IFile {
    uri: string;
    name: string;
    type: string;
    size: string;
    fileData: any;
}

interface IMezonImagePickerProps {
    onChange?: (url: string) => void;
    onLoad?: (url: string) => void;
    defaultValue: string;
    height?: DimensionValue;
    width?: DimensionValue;
    showHelpText?: boolean;
}

export default memo(function MezonImagePicker({ onChange, onLoad, defaultValue, height = 60, width = 60, showHelpText }: IMezonImagePickerProps) {
    const { themeValue } = useTheme();
    const styles = style(themeValue);
    const [image, setImage] = useState<string>(defaultValue);
    const currentChannel = useSelector(selectCurrentChannel);
    const { sessionRef, clientRef } = useMezon();

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

    async function handleUploadImage(file: IFile) {
        const session = sessionRef.current;
        const client = clientRef.current;

        if (!file || !client || !session) {
            throw new Error('Client is not initialized');
        }
        const ms = new Date().getTime();
        const fullFilename = `${currentChannel?.clan_id}/${currentChannel?.channel_id}/${ms}`.replace(/-/g, '_') + '/' + file.name;
        const res = await handleUploadFileMobile(client, session, fullFilename, file);
        return res.url;
    }

    async function handleImage() {
        const file = await handleSelectImage();
        if (file) {
            setImage(file.uri);
            onChange && onChange(file.uri);

            const url = await handleUploadImage(file);
            if (url) {
                setImage(url);
                onLoad && onLoad(url);
            }
        }
    }

    return (
        <TouchableOpacity onPress={handleImage}>
            <View style={styles.bannerContainer}>
                <View style={[styles.bannerWrapper, { height, width }]}>
                    {image || !showHelpText
                        ? <FastImage
                            source={{ uri: image }}
                            resizeMode="cover"
                            style={{ height: "100%" }}
                        />
                        : <Text style={styles.textPlaceholder}>Choose an image</Text>}
                </View>

                <View style={styles.btnWrapper}>
                    <Icons.PencilIcon height={12} width={12} color={themeValue.text} />
                </View>
            </View>
        </TouchableOpacity>
    )
}) 