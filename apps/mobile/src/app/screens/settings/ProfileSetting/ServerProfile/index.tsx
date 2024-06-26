import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAuth } from "@mezon/core";
import { ClansEntity, selectAllClans, selectCurrentClan, selectUserClanProfileByClanID } from "@mezon/store-mobile";
import { MezonBottomSheet } from "apps/mobile/src/app/temp-ui";
import { useRef, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View, Image } from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";
import { SeparatorWithSpace } from "apps/mobile/src/app/components/Common";
import { useEffect } from "react";
import { size, Text } from "@mezon/mobile-ui";
import { EProfileTab, IClanProfileValue } from "..";
import { ChevronIcon, HashSignIcon } from "@mezon/mobile-components";
import BannerAvatar, { IFile } from "../UserProfile/components/Banner";
import Toast from "react-native-toast-message";

interface IServerProfile {
    triggerToSave: EProfileTab;
	clanProfileValue?: IClanProfileValue;
	setCurrentUserProfileValue?: (updateFn: (prevValue: IClanProfileValue) => IClanProfileValue) => void;
}

export default function ServerProfile({ triggerToSave, clanProfileValue, setCurrentUserProfileValue}: IServerProfile) {
    const { userProfile, userId } = useAuth();
    const bottomSheetDetail = useRef<BottomSheetModal>(null)
    const clans = useSelector(selectAllClans);
    const currentClan = useSelector(selectCurrentClan);
    const [selectedClan, setSelectedClan] = useState<ClansEntity>(currentClan);
    const userClansProfile = useSelector(selectUserClanProfileByClanID(selectedClan?.clan_id || '', userProfile?.user?.id || ''));
    const [file, setFile] = useState<IFile>(null);
    
    const openBottomSheet = () => {
        bottomSheetDetail.current.present();
    }

    const onPressHashtag = () => {
		Toast.show({
			type: 'info',
			text1: 'Original known as ' + userProfile.user.username + '#' + userId,
		});
	}

    const handleAvatarChange = (data: IFile) => {
		setCurrentUserProfileValue((prevValue) => ({...prevValue, imgUrl: data?.uri}))
		setFile(data);
	}
    return (
        <View style={{ width: Dimensions.get("screen").width}}>
            <TouchableOpacity onPress={() => openBottomSheet()} style={styles.actionItem}>
                <View style={[styles.clanAvatarWrapper]}>
                    {selectedClan?.logo ? (
                        <Image style={styles.avatar} source={{uri: selectedClan?.logo}} resizeMode="cover" />
                    ): (
                        <View style={styles.avatar}>
                            <Text style={styles.textAvatar}>{selectedClan?.clan_name?.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.clanName}>{selectedClan?.clan_name}</Text>
                </View>
                <ChevronIcon height={15} width={15} />
            </TouchableOpacity>

            <BannerAvatar avatar={userClansProfile?.avartar} onChange={handleAvatarChange} />

            <View style={styles.btnGroup}>
				<TouchableOpacity onPress={() => onPressHashtag()} style={styles.btnIcon}>
					<HashSignIcon width={16} height={16} />
				</TouchableOpacity>
			</View>



            <MezonBottomSheet ref={bottomSheetDetail} title="Choose a server">
                <View style={styles.bottomSheetContainer}>
                    <FlatList
                        data={clans}
                        keyExtractor={(item) => item?.id}
                        ItemSeparatorComponent={SeparatorWithSpace}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity style={styles.clanItem} onPress={() => setSelectedClan(item)}>
                                    <Image style={{height: 30, width: 30}} source={{uri: item?.logo || ''}} />
                                    <Text>{item?.clan_name}</Text>
                                    {item?.clan_id === selectedClan?.clan_id ? (
                                        <Text>checked</Text>
                                    ): null}
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </MezonBottomSheet>
        </View>
    )
}