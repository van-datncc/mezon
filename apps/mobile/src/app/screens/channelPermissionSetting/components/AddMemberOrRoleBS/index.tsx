import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Block, Colors, Text, size, useTheme } from '@mezon/mobile-ui';
import {
	channelUsersActions,
	selectAllRolesClan,
	selectAllUsesClan,
	selectCurrentClanId,
	selectEveryoneRole,
	selectMembersByChannelId,
	selectRolesByChannelId,
	useAppDispatch
} from '@mezon/store-mobile';
import { memo, useCallback, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { MezonInput } from '../../../../temp-ui';
import { IAddMemberOrRoleBSProps } from '../../types/channelPermission.type';
import { MemberItem } from '../MemberItem';
import { RoleItem } from '../RoleItem';

export const AddMemberOrRoleBS = memo(({ bottomSheetRef, channel }: IAddMemberOrRoleBSProps) => {
	const { themeValue } = useTheme();
	const [searchText, setSearchText] = useState('');
	const currentClanId = useSelector(selectCurrentClanId);
	const everyoneRole = useSelector(selectEveryoneRole);
	const dispatch = useAppDispatch();
	const [selectedMemberIdList, setSelectedMemberIdList] = useState<string[]>([]);
	const [selectedRoleIdList, setSelectedRoleIdList] = useState<string[]>([]);

	const allClanMembers = useSelector(selectAllUsesClan);
	const allClanRoles = useSelector(selectAllRolesClan);

	const listOfChannelMember = useSelector(selectMembersByChannelId(channel?.channel_id));
	const listOfChannelRole = useSelector(selectRolesByChannelId(channel?.channel_id));

	const listOfMemberCanAdd = useMemo(() => {
		const addedMemberIdList = listOfChannelMember?.filter((member) => member.userChannelId !== '0')?.map((member) => member?.user?.id) || [];
		return allClanMembers?.filter((member) => !addedMemberIdList.includes(member?.user?.id));
	}, [listOfChannelMember, allClanMembers]);

	const listOfRoleCanAdd = useMemo(() => {
		const addedRoleIdList = listOfChannelRole?.map((role) => role?.id) || [];
		return allClanRoles?.filter((role) => !addedRoleIdList.includes(role?.id) && everyoneRole?.id !== role?.id);
	}, [listOfChannelRole, allClanRoles, everyoneRole?.id]);

	const disableAddButton = useMemo(() => {
		return !(selectedMemberIdList.length || selectedRoleIdList.length);
	}, [selectedMemberIdList, selectedRoleIdList]);

	const onBottomSheetDismiss = useCallback(() => {
		//TODO
		setSelectedRoleIdList([]);
		setSelectedMemberIdList([]);
	}, []);

	const addMemberOrRole = async () => {
		if (disableAddButton) return;
		if (selectedMemberIdList.length > 0) {
			const body = {
				channelId: channel.id,
				channelType: channel.type,
				userIds: selectedMemberIdList,
				clanId: currentClanId || ''
			};
			await dispatch(channelUsersActions.addChannelUsers(body));
		}
		if (selectedRoleIdList.length > 0) {
			const body = {
				clanId: currentClanId || '',
				channelId: channel.id,
				roleIds: selectedRoleIdList,
				channelType: channel.type
			};
			await dispatch(channelUsersActions.addChannelRoles(body));
		}
	};

	console.log('allClanRoles', allClanRoles, allClanMembers);
	console.log('listOfChannelRole222', listOfChannelRole, listOfChannelMember);

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={['85%']}
			style={{
				borderTopLeftRadius: size.s_14,
				borderTopRightRadius: size.s_14,
				overflow: 'hidden'
			}}
			onDismiss={onBottomSheetDismiss}
			backgroundStyle={{ backgroundColor: themeValue.primary }}
		>
			<Block paddingHorizontal={size.s_14} flex={1}>
				<Block flexDirection="row" justifyContent="center">
					<Block alignItems="center">
						<Text h4 bold color={themeValue.white}>
							{'Add members or roles'}
						</Text>
						<Text color={themeValue.text}>#{channel?.channel_label}</Text>
					</Block>
					<TouchableOpacity
						onPress={addMemberOrRole}
						style={{
							position: 'absolute',
							top: 0,
							right: 0
						}}
						disabled={disableAddButton}
					>
						<Block padding={size.s_10}>
							<Text bold h4 color={Colors.textViolet}>
								{'Add'}
							</Text>
						</Block>
					</TouchableOpacity>
				</Block>

				<Block paddingVertical={size.s_16}>
					<MezonInput value={searchText} onTextChange={setSearchText} placeHolder={'Search Roles & Members'} />
				</Block>
				<BottomSheetScrollView>
					<Block gap={size.s_16} marginBottom={size.s_18}>
						<Block gap={size.s_16}>
							<Text color={themeValue.textDisabled}>{'ROLES'}</Text>
							{listOfRoleCanAdd.map((role) => {
								return <RoleItem key={role?.id} role={role} channel={channel} isCheckbox={true} />;
							})}
						</Block>

						<Block gap={size.s_16}>
							<Text color={themeValue.textDisabled}>{'MEMBERS'}</Text>
							{listOfMemberCanAdd?.map((member) => {
								return <MemberItem key={member?.id} member={member} channelId={channel?.channel_id} isCheckbox={true} />;
							})}
						</Block>
					</Block>
				</BottomSheetScrollView>
				{/* <BottomSheetFlatList /> */}
			</Block>
		</BottomSheetModal>
	);
});
