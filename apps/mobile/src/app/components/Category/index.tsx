import { useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { ApiCreateCategoryDescRequest } from 'mezon-js/api.gen';
import { categoriesActions, selectCurrentClanId, useAppDispatch } from '@mezon/store-mobile';
import { useSelector } from 'react-redux';
import { APP_SCREEN, MenuClanScreenProps } from '../../navigation/ScreenTypes';
import styles from './style';
import { CrossIcon, LockIcon } from '@mezon/mobile-components';
import { Colors } from '@mezon/mobile-ui';
import { useTranslation } from 'react-i18next';

type CreateCategoryScreen = typeof APP_SCREEN.MENU_CLAN.CREATE_CATEGORY;
export default function CategoryCreator({ navigation }: MenuClanScreenProps<CreateCategoryScreen>) {
    const [isPrivate, setPrivate] = useState<boolean>(false);
    const [categoryName, setCategoryName] = useState<string>("");
    const dispatch = useAppDispatch();
    const currentClanId = useSelector(selectCurrentClanId);
    const { t } = useTranslation(['categoryCreator']);

    navigation.setOptions({
        headerRight: () => (
            <Pressable onPress={handleCreateCategory}>
                <Text style={{
                    color: "white",
                    paddingHorizontal: 20,
                    opacity: categoryName.trim().length > 0 ? 1 : 0.5
                }}>
                    {t("actions.create")}
                </Text>
            </Pressable>
        ),

        headerLeft: () => (
            <Pressable style={{ padding: 20 }} onPress={handleClose}>
                <CrossIcon height={16} width={16} />
            </Pressable>
        ),
    });

    const handleCreateCategory = async () => {
        if (categoryName.trim().length === 0) return;

        const body: ApiCreateCategoryDescRequest = {
            clan_id: currentClanId?.toString(),
            category_name: categoryName.trim(),
        };
        await dispatch(categoriesActions.createNewCategory(body));
        setCategoryName('');

        navigation.navigate(APP_SCREEN.HOME);
    };

    function handleClose() {
        navigation.goBack();
    }

    function handleTogglePrivate() {
        setPrivate(previousState => !previousState);
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.label}>{t('fields.cateName.title')}</Text>
                <TextInput
                    placeholderTextColor={'gray'}
                    placeholder={t('fields.cateName.placeholder')}
                    style={styles.input}
                    value={categoryName}
                    onChangeText={setCategoryName}
                />
            </View>

            <View>
                <View style={styles.checkboxWrapper}>
                    <View style={styles.labelIconWrapper}>
                        <LockIcon height={18} width={18} />
                        <Text style={styles.labelNormal}>{t('fields.catePrivate.title')}</Text>
                    </View>
                    <Switch
                        trackColor={{ false: Colors.gray48, true: Colors.green }}
                        onValueChange={handleTogglePrivate}
                        value={isPrivate}
                    />
                </View>
                <Text style={styles.description}>
                    {t('fields.catePrivate.description')}
                </Text>
            </View>
        </View>
    )
}

