import { Block, Colors, Text, size, useTheme } from "@mezon/mobile-ui";
import { Pressable, TouchableOpacity } from "react-native"
import { APP_SCREEN, MenuClanScreenProps } from "../../../navigation/ScreenTypes";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentClanId } from "@mezon/store-mobile";
import { CheckIcon, Icons } from "@mezon/mobile-components";
import { MezonInput } from "../../../temp-ui";
import { useState } from "react";
import { useRoles } from "@mezon/core";
import Toast from "react-native-toast-message";

type CreateNewRoleScreen = typeof APP_SCREEN.MENU_CLAN.CREATE_NEW_ROLE;
export const CreateNewRole = ({ navigation }: MenuClanScreenProps<CreateNewRoleScreen>) => {
    const { t } = useTranslation('clanRoles');
    const [roleName, setRoleName] = useState('');
    const currentClanId = useSelector(selectCurrentClanId);
    const { createRole } = useRoles();
    const { themeValue } = useTheme();

    navigation.setOptions({
        headerTitle: t('createNewRole.title'),
        headerLeft: () => (
            <Pressable style={{ padding: 20 }} onPress={() => navigation.navigate(APP_SCREEN.MENU_CLAN.ROLE_SETTING)}>
                <Icons.CloseSmallBoldIcon height={20} width={20} color={themeValue.textStrong} />
            </Pressable>
        ),
    });

    const onRoleNameChange = (roleName: string) => {
        setRoleName(roleName);
    }

    const createNewRole = async () => {
        await createRole(currentClanId, currentClanId, roleName, [], []);
        navigation.navigate(APP_SCREEN.MENU_CLAN.SETUP_PERMISSIONS);
        Toast.show({
            type: 'success',
            props: {
                text2: t('createNewRole.createSuccess', { roleName }),
                leadingIcon: <CheckIcon color={Colors.green} width={20} height={20} />
            }
        });
    }
    return (
        <Block
            backgroundColor={themeValue.primary}
            flex={1}
            paddingHorizontal={size.s_14}
            justifyContent="space-between"
        >
            <Block>
                <Block
                    paddingVertical={size.s_10}
                    borderBottomWidth={1}
                    borderBottomColor={themeValue.borderDim}
                >
                    <Text color={themeValue.white} h2 center bold>{t('createNewRole.createANewRole')}</Text>
                    <Text color={themeValue.text} center>{t('createNewRole.description')}</Text>
                </Block>
                <Block marginTop={size.s_18}>
                    <MezonInput
                        value={roleName}
                        onTextChange={onRoleNameChange}
                        placeHolder={t('createNewRole.newRole')}
                        label={t('createNewRole.roleName')}
                    />
                </Block>
            </Block>
            <Block marginBottom={size.s_16}>
                <TouchableOpacity onPress={() => {
                    if (roleName.trim().length === 0) return;
                    createNewRole()
                }}>
                    <Block
                        backgroundColor={roleName.trim().length === 0 ? Colors.bgGrayDark : Colors.bgViolet}
                        paddingVertical={size.s_14}
                        borderRadius={size.s_8}
                    >
                        <Text center color={Colors.white}>{t('createNewRole.create')}</Text>
                    </Block>
                </TouchableOpacity>
            </Block>
        </Block>
    )
}