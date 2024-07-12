import { Block, Colors, Text, size, useTheme } from "@mezon/mobile-ui";
import { FlatList, Pressable, TouchableOpacity, Image } from "react-native"
import { APP_SCREEN, MenuClanScreenProps } from "../../../navigation/ScreenTypes";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectAllRolesClan, selectAllUsesClan } from "@mezon/store-mobile";
import { CheckIcon, Icons } from "@mezon/mobile-components";
import Toast from "react-native-toast-message";
import { SeparatorWithLine } from "../../../components/Common";
import BouncyCheckbox from "react-native-bouncy-checkbox/build/dist/BouncyCheckbox";
import { useRoles } from "@mezon/core";
import { useMemo, useState } from "react";
import { normalizeString } from "../../../utils/helpers";
import { MezonInput } from "../../../temp-ui";
import { isEqual } from "lodash";
import { useEffect } from "react";

type SetupMembersScreen = typeof APP_SCREEN.MENU_CLAN.SETUP_ROLE_MEMBERS;
export const SetupMembers = ({ navigation, route }: MenuClanScreenProps<SetupMembersScreen>) => {
    const roleId = route.params?.roleId;
    const { t } = useTranslation('clanRoles');
    const RolesClan = useSelector(selectAllRolesClan);
    const usersClan = useSelector(selectAllUsesClan);
    const [originSelectedMembers, setOriginSelectedMembers] = useState<string[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [searchMemberText, setSearchMemberText] = useState('');
    const { themeValue } = useTheme();
    const { updateRole } = useRoles();

    //Note: create new role
    const newRole = useMemo(() => {
        return RolesClan?.[RolesClan.length - 1];
    }, [RolesClan])

    //Note: edit role
    const clanRole = useMemo(() => {
        return RolesClan.find(role => role?.id === roleId)
    }, [roleId, RolesClan])

    const isEditRoleMode = useMemo(() => {
        return Boolean(roleId);
    }, [roleId])

    const isNotChange = useMemo(() => {
        return isEqual(originSelectedMembers, selectedMembers);
    }, [originSelectedMembers, selectedMembers])

    const handleEditMember = async () => {
        const selectedPermissions = clanRole?.permission_list?.permissions?.filter(it => it?.active).map(it => it?.id);
        const removeMemberList = clanRole?.role_user_list?.role_users?.filter(member => !selectedMembers.includes(member?.id)).map(it => it?.id) || [];
        await updateRole(clanRole.clan_id, clanRole.id, clanRole?.title, selectedMembers, selectedPermissions, removeMemberList, []);
        Toast.show({
            type: 'success',
            props: {
                text2: t('roleDetail.changesSaved'),
                leadingIcon: <CheckIcon color={Colors.green} width={20} height={20} />
            }
        });
        navigation.goBack();
    }

    navigation.setOptions({
        headerTitle: !isEditRoleMode ? t('setupMember.title') : () => {
            return (
                <Block>
                    <Text center bold h3 color={themeValue?.white}>{clanRole?.title}</Text>
                    <Text center color={themeValue?.text}>{t('roleDetail.role')}</Text>
                </Block>
            )
        },
        headerLeft: () => (
            <Pressable style={{ padding: 20 }} onPress={() => navigation.navigate(APP_SCREEN.MENU_CLAN.ROLE_SETTING)}>
                <Icons.CloseSmallBoldIcon height={20} width={20} color={themeValue.textStrong} />
            </Pressable>
        ),
        headerRight: () => {
            if (!isEditRoleMode || (isEditRoleMode && isNotChange)) return null;
            return (
                <TouchableOpacity onPress={() => handleEditMember()}>
                    <Block marginRight={size.s_14}>
                        <Text h4 color={Colors.textViolet}>{t('roleDetail.save')}</Text>
                    </Block>
                </TouchableOpacity>
            )
        }
    });

    useEffect(() => {
        if (clanRole?.id) {
            const currentSelectedMembers = clanRole?.role_user_list?.role_users?.map(user => user?.id);
            setOriginSelectedMembers(currentSelectedMembers);
            setSelectedMembers(currentSelectedMembers);
        }
    }, [clanRole])

    const onSelectMemberChange = (value: boolean, memberId: string) => {
        const uniqueSelectedMembers = new Set(selectedMembers);
        if (value) {
            uniqueSelectedMembers.add(memberId);
            setSelectedMembers([...uniqueSelectedMembers]);
            return;
        }
        uniqueSelectedMembers.delete(memberId);
        setSelectedMembers([...uniqueSelectedMembers]);
    }

    const updateMemberToRole = async () => {
        const selectedPermissions = newRole?.permission_list?.permissions.filter(it => it?.active).map(it => it?.id);
        await updateRole(newRole.clan_id, newRole.id, newRole.title, selectedMembers, selectedPermissions, [], []);
        navigation.navigate(APP_SCREEN.MENU_CLAN.ROLE_SETTING);
        Toast.show({
            type: 'success',
            props: {
                text2: t('setupMember.addedMember', { memberCount: selectedMembers.length }),
                leadingIcon: <CheckIcon color={Colors.green} width={20} height={20} />
            }
        });
    }

    const filteredMemberList = useMemo(() => {
        return usersClan.filter(it =>
            normalizeString(it?.user?.display_name).includes(normalizeString(searchMemberText)) ||
            normalizeString(it?.user?.username).includes(normalizeString(searchMemberText))
        );
    }, [searchMemberText, usersClan]);

    return (
        <Block
            backgroundColor={themeValue.primary}
            flex={1}
            paddingHorizontal={size.s_14}
        >
            <Block flex={1}>
                <Block
                    paddingVertical={size.s_10}
                    borderBottomWidth={1}
                    borderBottomColor={themeValue.borderDim}
                >
                    <Text color={themeValue.white} h2 center bold>{t('setupMember.addMember')}</Text>
                    <Text center color={themeValue.text}>{t('setupMember.description')}</Text>
                </Block>

                <MezonInput
                    value={searchMemberText}
                    onTextChange={setSearchMemberText}
                    placeHolder={t('setupMember.searchMembers')}
                />

                <Block marginVertical={size.s_10} flex={1}>
                    <Block borderRadius={size.s_10} overflow="hidden">
                        <FlatList
                            data={filteredMemberList}
                            keyExtractor={(item) => item?.id}
                            ItemSeparatorComponent={SeparatorWithLine}
                            renderItem={({item}) => {
                                return (
                                    <TouchableOpacity onPress={() => onSelectMemberChange(!selectedMembers?.includes(item?.id), item?.id)}>
                                        <Block
                                            flexDirection="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            backgroundColor={themeValue.secondary}
                                            padding={size.s_12}
                                            gap={size.s_10}
                                        >
                                            <Block flex={1} flexDirection="row" gap={size.s_10} alignItems="center">
                                                {item?.user?.avatar_url ? (
                                                    <Image
                                                        source={{ uri: item?.user?.avatar_url }}
                                                        style={{
                                                            width: size.s_40,
                                                            height: size.s_40,
                                                            borderRadius: 50
                                                        }}
                                                    />
                                                ): (
                                                    <Text
                                                        style={{
                                                            backgroundColor: Colors.vividScarlet,
                                                            width: size.s_40,
                                                            height: size.s_40,
                                                            textAlign: 'center',
                                                            textAlignVertical: 'center',
                                                            borderRadius: 50,
                                                            fontSize: size.h5,
                                                            color: Colors.white
                                                        }}
                                                    >{item?.user?.username?.charAt?.(0)?.toUpperCase()}</Text>
                                                )}
                                                    <Block>
                                                        {item?.user?.display_name ? (
                                                            <Text color={themeValue.white}>{item?.user?.display_name}</Text>
                                                        ): null}
                                                        <Text color={themeValue.text}>{item?.user?.username}</Text>
                                                    </Block>
                                            </Block>

                                            <Block height={size.s_20} width={size.s_20}>
                                                <BouncyCheckbox
                                                    size={20}
                                                    isChecked={selectedMembers?.includes(item?.id)}
                                                    onPress={(value) => onSelectMemberChange(value, item?.id)}
                                                    fillColor={Colors.bgButton}
                                                    iconStyle={{ borderRadius: 5 }}
                                                    innerIconStyle={{
                                                        borderWidth: 1.5,
                                                        borderColor: selectedMembers?.includes(item?.id) ? Colors.bgButton : Colors.tertiary,
                                                        borderRadius: 5,
                                                    }}
                                                    textStyle={{ fontFamily: "JosefinSans-Regular" }}
                                                />
                                            </Block>
                                        </Block>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </Block>
                </Block>
            </Block>

            {!isEditRoleMode ? (
                <Block marginBottom={size.s_16} gap={size.s_10}>
                    <TouchableOpacity onPress={() => updateMemberToRole()}>
                        <Block
                            backgroundColor={Colors.bgViolet}
                            paddingVertical={size.s_14}
                            borderRadius={size.s_8}
                        >
                            <Text center color={Colors.white}>{t('setupMember.finish')}</Text>
                        </Block>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate(APP_SCREEN.MENU_CLAN.ROLE_SETTING)}>
                        <Block
                            backgroundColor={'gray'}
                            paddingVertical={size.s_14}
                            borderRadius={size.s_8}
                        >
                            <Text center color={Colors.white}>{t('skipStep')}</Text>
                        </Block>
                    </TouchableOpacity>
                </Block>
            ): null}
            {/* TODO: add bottom sheet */}
        </Block>
    )
}