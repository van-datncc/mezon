import { useAuth } from '@mezon/core';
import { ArrowLeftIcon } from '@mezon/mobile-components';
import { Colors } from '@mezon/mobile-ui';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Text, TouchableOpacity, View } from 'react-native';
import MezonTabHeader from '../../../temp-ui/MezonTabHeader';
import MezonTabView from '../../../temp-ui/MezonTabView';
import ServerProfile from './ServerProfile';
import UserProfile from './UserProfile';
import styles from './styles';

export enum EProfileTab {
	UserProfile,
	ClanProfile,
}

export interface IUserProfileValue {
	username: string;
	imgUrl: string;
	displayName: string;
	aboutMe: string;
}

export interface IClanProfileValue {
	username: string;
	displayName: string;
	imgUrl: string;
}

export const ProfileSetting = ({ navigation }: { navigation: any }) => {
	const user = useAuth();
	const [tab, setTab] = useState<number>(0);
	const [triggerToSaveTab, setTriggerToSaveTab] = useState<EProfileTab | null>(null);
	const { t } = useTranslation(['profileSetting']);

	const [originUserProfileValue, setOriginUserProfileValue] = useState<IUserProfileValue>({
		username: '',
		imgUrl: '',
		displayName: '',
		aboutMe: '',
	});
	const [currentUserProfileValue, setCurrentUserProfileValue] = useState<IUserProfileValue>({
		username: '',
		imgUrl: '',
		displayName: '',
		aboutMe: '',
	});

	const [originClanProfileValue, setOriginClanProfileValue] = useState<IClanProfileValue>({
		username: '',
		imgUrl: '',
		displayName: '',
	});
	const [currentClanProfileValue, setCurrentClanProfileValue] = useState<IClanProfileValue>({
		username: '',
		imgUrl: '',
		displayName: '',
	});

	const isUserProfileNotChanged = useMemo(() => {
		return isEqual(originUserProfileValue, currentUserProfileValue);
	}, [originUserProfileValue, currentUserProfileValue]);

	const isClanProfileNotChanged = useMemo(() => {
		return isEqual(originClanProfileValue, currentClanProfileValue);
	}, [originClanProfileValue, currentClanProfileValue]);

	useEffect(() => {
		if (user?.userId) {
			const { display_name, avatar_url, username, about_me } = user?.userProfile?.user || {};
			const initialValue = {
				username,
				imgUrl: avatar_url,
				displayName: display_name,
				aboutMe: about_me,
			};
			setOriginUserProfileValue(initialValue);
			setCurrentUserProfileValue(initialValue);
		}
	}, [user]);

	const setDefaultValueClanProfile = useCallback((clanProfileValue: IClanProfileValue) => {
		setOriginClanProfileValue(clanProfileValue);
		setCurrentClanProfileValue(clanProfileValue);
	}, []);

	navigation.setOptions({
		headerRight: () => (
			<Pressable onPress={() => saveCurrentTab()}>
				<Text style={[styles.saveChangeButton, !isUserProfileNotChanged || !isClanProfileNotChanged ? styles.changed : styles.notChange]}>
					{t('header.save')}
				</Text>
			</Pressable>
		),
		headerLeft: () => (
			<TouchableOpacity onPress={() => handleBack()} style={styles.backArrow}>
				<ArrowLeftIcon color={Colors.textGray} />
			</TouchableOpacity>
		),
	});

	const handleBack = () => {
		if (isUserProfileNotChanged && isClanProfileNotChanged) {
			navigation.goBack();
			return;
		}

		Alert.alert(
			t('changedAlert.title'),
			t('changedAlert.description'),
			[
				{
					text: t('changedAlert.keepEditing'),
					style: 'cancel',
				},
				{
					text: t('changedAlert.discard'),
					onPress: () => navigation.goBack(),
				},
			],
			{ cancelable: false },
		);
	};

	const handleTabChange = (index: number) => {
		setTab(index);
	};

	const saveCurrentTab = () => {
		if (isUserProfileNotChanged && isClanProfileNotChanged) {
			return;
		}
		if (tab === EProfileTab.UserProfile) {
			setTriggerToSaveTab(EProfileTab.UserProfile);
			return;
		}

		if (tab === EProfileTab.ClanProfile) {
			setTriggerToSaveTab(EProfileTab.ClanProfile);
			return;
		}
	};

	const confirmCallback = async (): Promise<boolean> => {
		return new Promise((resolve) => {
			Alert.alert(
				t('changedAlert.title'),
				t('changedAlert.description'),
				[
					{
						text: t('changedAlert.keepEditing'),
						style: 'cancel',
						onPress: () => resolve(false),
					},
					{
						text: t('changedAlert.discard'),
						onPress: () => {
							resolve(true);
							switch (tab) {
								case EProfileTab.UserProfile:
									setCurrentUserProfileValue(originUserProfileValue);
									break;
								case EProfileTab.ClanProfile:
									setCurrentClanProfileValue(originClanProfileValue);
									break;
								default:
									break;
							}
						},
					},
				],
				{ cancelable: false },
			);
		});
	};

	return (
		<View style={styles.container}>
			<MezonTabHeader
				tabIndex={tab}
				onChange={handleTabChange}
				isNeedConfirmWhenSwitch={!isUserProfileNotChanged || !isClanProfileNotChanged}
				confirmCallback={confirmCallback}
				tabs={[t('switch.userProfile'), t('switch.serverProfile')]}
			/>

			<MezonTabView
				pageIndex={tab}
				onChange={handleTabChange}
				views={[
					<UserProfile
						triggerToSave={triggerToSaveTab}
						userProfileValue={currentUserProfileValue}
						setCurrentUserProfileValue={setCurrentUserProfileValue}
					/>,
					<ServerProfile
						triggerToSave={triggerToSaveTab}
						clanProfileValue={currentClanProfileValue}
						isClanProfileNotChanged={isClanProfileNotChanged}
						setDefaultValue={setDefaultValueClanProfile}
						setCurrentClanProfileValue={setCurrentClanProfileValue}
					/>,
				]}
			/>
		</View>
	);
};
