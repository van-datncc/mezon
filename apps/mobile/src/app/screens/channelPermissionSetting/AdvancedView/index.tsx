import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Icons } from '@mezon/mobile-components';
import { Block, size, Text, useTheme } from '@mezon/mobile-ui';
import {
	selectAllChannelMembers,
	selectAllRolesClan,
	selectAllUserClans,
	selectEveryoneRole,
	selectPermissionChannel,
	selectRolesByChannelId,
	useAppSelector
} from '@mezon/store-mobile';
import { EVERYONE_ROLE_ID, EVERYONE_ROLE_TITLE } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { SeparatorWithLine } from '../../../components/Common';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { AdvancedSettingBS } from '../components/AdvancedSettingBS';
import { RoleItem } from '../components/RoleItem';
import { EAdvancedPermissionSetting } from '../types/channelPermission.enum';
import { IAdvancedViewProps } from '../types/channelPermission.type';

export const AdvancedView = memo(({ isAdvancedEditMode, channel }: IAdvancedViewProps) => {
	const { themeValue } = useTheme();
	const navigation = useNavigation<any>();
	const { t } = useTranslation('channelSetting');
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const [currentAdvancedPermissionType, setCurrentAdvancedPermissionType] = useState<EAdvancedPermissionSetting | null>(null);
	const everyoneRole = useSelector(selectEveryoneRole);
	const allClanRoles = useSelector(selectAllRolesClan);
	const allClanMembers = useSelector(selectAllUserClans);

	const listOfChannelRole = useSelector(selectRolesByChannelId(channel?.channel_id));
	const listOfChannelMember = useAppSelector((state) => selectAllChannelMembers(state, channel.channel_id as string));

	const listPermission = useSelector(selectPermissionChannel);

	const rolesNotInChannel = useMemo(() => {
		const roleInChannelIds = new Set(listOfChannelRole.map((roleInChannel) => roleInChannel.id));
		return allClanRoles.filter((role) => !roleInChannelIds.has(role.id));
	}, [allClanRoles, listOfChannelRole]);
	const usersClan = useSelector(selectAllUserClans);

	const isPrivateChannel = useMemo(() => {
		return Boolean(channel?.channel_private);
	}, [channel?.channel_private]);

	const availableMemberList = useMemo(() => {
		if (isPrivateChannel) {
			return listOfChannelMember;
		}
		return allClanMembers;
	}, [listOfChannelMember, isPrivateChannel, allClanMembers]);

	const availableRoleList = useMemo(() => {
		if (isPrivateChannel) {
			return listOfChannelRole?.filter((role) => typeof role?.role_channel_active === 'number' && role?.role_channel_active === 1);
		}
		return [everyoneRole];
	}, [listOfChannelRole, isPrivateChannel, everyoneRole]);

	const actionList = useMemo(() => {
		return [
			{
				title: t('channelPermission.addRole'),
				type: EAdvancedPermissionSetting.AddRole
			},
			{
				title: t('channelPermission.addMember'),
				type: EAdvancedPermissionSetting.AddMember
			}
		];
	}, [t]);

	const advancedSettingRoleList = useMemo(() => {
		const isExistingEveryoneRole = listOfChannelRole?.some((role) => role?.id === EVERYONE_ROLE_ID);
		if (!isExistingEveryoneRole) {
			return [{ id: EVERYONE_ROLE_ID, title: EVERYONE_ROLE_TITLE }, ...listOfChannelRole];
		}
		return listOfChannelRole;
	}, [listOfChannelRole]);

	const navigateToPermissionOverridesDetail = useCallback(
		(roleId: string) => {
			navigation.navigate(APP_SCREEN.MENU_CHANNEL.STACK, {
				screen: APP_SCREEN.MENU_CHANNEL.ADVANCED_PERMISSION_OVERRIDES,
				params: {
					channelId: channel?.id,
					roleId
				}
			});
		},
		[navigation, channel?.id]
	);

	const onDismiss = useCallback(() => {
		//
		// setCurrentAdvancedPermissionType(null);
	}, []);

	const handleAction = (type: EAdvancedPermissionSetting) => {
		//TODO
		setCurrentAdvancedPermissionType(type);
		bottomSheetRef.current?.present();
	};
	return (
		<ScrollView>
			<Block>
				{!isAdvancedEditMode && (
					<Block borderRadius={size.s_14} overflow="hidden">
						<FlatList
							data={actionList}
							keyExtractor={(item) => item.type?.toString()}
							ItemSeparatorComponent={SeparatorWithLine}
							renderItem={({ item }) => {
								const { title, type } = item;
								return (
									<TouchableOpacity onPress={() => handleAction(type)}>
										<Block
											flexDirection="row"
											justifyContent="space-between"
											padding={size.s_14}
											alignItems="center"
											backgroundColor={themeValue.primary}
										>
											<Block flexDirection="row" gap={size.s_14} alignItems="center">
												<Icons.PlusLargeIcon />
												<Text color={themeValue.text}>{title}</Text>
											</Block>
										</Block>
									</TouchableOpacity>
								);
							}}
						/>
					</Block>
				)}

				<Block gap={size.s_10} marginBottom={size.s_10}>
					<Text color={themeValue.textDisabled}>{t('channelPermission.roles')}</Text>
					<Block backgroundColor={themeValue.primary} borderRadius={size.s_14}>
						{advancedSettingRoleList?.map((role) => {
							return (
								<RoleItem
									key={role?.id}
									role={role}
									channel={channel}
									isAdvancedSetting={true}
									onPress={navigateToPermissionOverridesDetail}
								/>
							);
						})}
					</Block>
				</Block>

				<Block gap={size.s_10} marginBottom={size.s_10}>
					{/* TODO: Update when api is ready */}
					{/* <Text color={themeValue.textDisabled}>{t('channelPermission.members')}</Text> */}
				</Block>

				<AdvancedSettingBS
					bottomSheetRef={bottomSheetRef}
					channel={channel}
					currentAdvancedPermissionType={currentAdvancedPermissionType}
					onDismiss={onDismiss}
				/>
			</Block>
		</ScrollView>
	);
});
