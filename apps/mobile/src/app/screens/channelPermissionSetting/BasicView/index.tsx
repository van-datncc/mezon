import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCheckOwnerForUser } from '@mezon/core';
import { Icons } from '@mezon/mobile-components';
import { Block, size, Text, useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity, selectAllUsesClan, selectEveryoneRole, selectMembersByChannelId, selectRolesByChannelId } from '@mezon/store-mobile';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { MezonConfirm, MezonSwitch } from '../../../temp-ui';
import { AddMemberOrRoleBS } from '../components/AddMemberOrRoleBS';
import { MemberItem } from '../components/MemberItem';
import { RoleItem } from '../components/RoleItem';

interface IBasicViewProps {
	channel: ChannelsEntity;
}

export const BasicView = memo(({ channel }: IBasicViewProps) => {
	const { themeValue } = useTheme();
	const [checkClanOwner] = useCheckOwnerForUser();
	// const dispatch = useAppDispatch();
	const { t } = useTranslation('channelSetting');
	const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const everyoneRole = useSelector(selectEveryoneRole);
	const allClanMembers = useSelector(selectAllUsesClan);

	const listOfChannelRole = useSelector(selectRolesByChannelId(channel?.channel_id));
	const listOfChannelMember = useSelector(selectMembersByChannelId(channel?.channel_id));

	const clanOwner = useMemo(() => {
		return allClanMembers?.find((member) => checkClanOwner(member?.user?.id));
	}, [allClanMembers, checkClanOwner]);

	const isPrivateChannel = useMemo(() => {
		return Boolean(channel?.channel_private);
	}, [channel?.channel_private]);

	const availableMemberList = useMemo(() => {
		if (isPrivateChannel) {
			return listOfChannelMember;
		}
		return [clanOwner];
	}, [listOfChannelMember, isPrivateChannel, clanOwner]);

	const availableRoleList = useMemo(() => {
		if (isPrivateChannel) {
			return listOfChannelRole?.filter((role) => typeof role?.role_channel_active === 'number' && role?.role_channel_active === 1);
		}
		return [everyoneRole];
	}, [listOfChannelRole, isPrivateChannel, everyoneRole]);

	const onPrivateChannelChange = useCallback((value: boolean) => {
		//TODO
		setVisibleModalConfirm(true);
	}, []);

	const openBottomSheet = () => {
		bottomSheetRef.current?.present();
	};

	const updateChannel = async () => {
		//TODO
	};

	const closeModalConfirm = () => {
		//TODO
	};
	return (
		<ScrollView>
			<TouchableOpacity onPress={() => onPrivateChannelChange(!isPrivateChannel)}>
				<Block
					flexDirection="row"
					justifyContent="space-between"
					padding={size.s_14}
					alignItems="center"
					borderRadius={size.s_14}
					backgroundColor={themeValue.primary}
					marginBottom={size.s_16}
				>
					<Block alignItems="center">
						<Text color={themeValue.text}>{t('channelPermission.privateChannel')}</Text>
					</Block>
					<MezonSwitch value={isPrivateChannel} onValueChange={onPrivateChannelChange} />
				</Block>
			</TouchableOpacity>

			{isPrivateChannel && (
				<Block>
					<Text color={themeValue.textDisabled}>{t('channelPermission.basicViewDescription')}</Text>

					<TouchableOpacity onPress={() => openBottomSheet()}>
						<Block
							flexDirection="row"
							justifyContent="space-between"
							padding={size.s_14}
							alignItems="center"
							borderRadius={size.s_14}
							backgroundColor={themeValue.primary}
							marginVertical={size.s_16}
						>
							<Block flexDirection="row" gap={size.s_14} alignItems="center">
								<Icons.CirclePlusPrimaryIcon />
								<Text color={themeValue.text}>{t('channelPermission.addMemberAndRoles')}</Text>
							</Block>
							<Icons.ChevronSmallRightIcon />
						</Block>
					</TouchableOpacity>
				</Block>
			)}

			<Block gap={size.s_10} marginBottom={size.s_10}>
				<Text color={themeValue.textDisabled}>{t('channelPermission.whoCanAccess')}</Text>
				<Block backgroundColor={themeValue.primary} borderRadius={size.s_14}>
					{availableRoleList?.map((role) => {
						return <RoleItem key={role?.id} role={role} channel={channel} />;
					})}
				</Block>

				<Block backgroundColor={themeValue.primary} borderRadius={size.s_14}>
					{availableMemberList?.map((member) => {
						return <MemberItem key={member?.id} member={member} channelId={channel?.channel_id} />;
					})}
				</Block>
			</Block>

			<MezonConfirm
				visible={visibleModalConfirm}
				onVisibleChange={setVisibleModalConfirm}
				onConfirm={updateChannel}
				onCancel={closeModalConfirm}
				title={isPrivateChannel ? 'Make this channel private?' : 'Make this channel open to everyone?'}
				confirmText={'Yes'}
				content={
					isPrivateChannel
						? `${channel?.channel_label} will become available to all members`
						: `${channel?.channel_label} will become private and visible to select members and roles`
				}
				hasBackdrop={true}
			/>
			<AddMemberOrRoleBS bottomSheetRef={bottomSheetRef} channel={channel} />
		</ScrollView>
	);
});
