import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Icons } from "@mezon/mobile-components";
import { baseColor, useTheme } from "@mezon/mobile-ui";
import { selectAllUsesClan, useAppSelector } from "@mezon/store-mobile";
import { useMemo, useRef } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { APP_SCREEN, MenuClanScreenProps } from "../../../navigation/ScreenTypes";
import { IMezonMenuContextItemProps, MezonBottomSheet, MezonMenuContext, MezonSearch } from "../../../temp-ui";
import { style } from "./styles";
import UserItem from "./UserItem";

type MemberClanScreen = typeof APP_SCREEN.MENU_CLAN.MEMBER_SETTING;
export default function MemberSetting({ navigation }: MenuClanScreenProps<MemberClanScreen>) {
    const { themeValue } = useTheme();
    const styles = style(themeValue);
    const usersClan = useAppSelector(selectAllUsesClan);
    const memberPruneBSRef = useRef<BottomSheetModal>();
    const memberFilterBSRef = useRef<BottomSheetModal>();

    const menuContext = useMemo(() => [
        {
            title: "Filter",
            onPress: () => {
                memberFilterBSRef?.current?.present();
            }
        },
        {
            title: "Prune",
            onPress: () => {
                memberPruneBSRef?.current?.present();
            },
            titleStyle: { color: baseColor.redStrong }
        }
    ] satisfies IMezonMenuContextItemProps[], [])

    navigation.setOptions({
        headerRight: () => (
            <MezonMenuContext
                icon={<Icons.MoreHorizontalIcon
                    color={themeValue.text}
                    height={20} width={20}
                    style={{ marginRight: 20 }}
                />}
                menu={menuContext}
            />
        )
    })

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <TouchableWithoutFeedback>
                <View style={styles.container}>
                    <MezonSearch />
                    <ScrollView contentContainerStyle={styles.userList}>
                        {usersClan?.map((item, index) => (
                            <UserItem
                                key={item.id}
                                userID={item.id}
                                hasBorder={index != usersClan.length - 1}
                            />
                        ))}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>

            <MezonBottomSheet
                heightFitContent
                title="Member Prune"
                ref={memberPruneBSRef}
            >
                {/* MemberPrune */}
                <Text>Member Prune</Text>
            </MezonBottomSheet>

            <MezonBottomSheet
                heightFitContent
                title="Member Filter"
                ref={memberFilterBSRef}
            >
                {/* MemberFilter */}
                <Text>Member Filter</Text>
            </MezonBottomSheet>
        </KeyboardAvoidingView>
    )
}