import { Block, size, useTheme } from '@mezon/mobile-ui';
import { UsersClanEntity, selectAllUserClans, useAppSelector } from '@mezon/store-mobile';
import { memo, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { MezonInput } from '../../../../temp-ui';
import { normalizeString } from '../../../../utils/helpers';
import { SeparatorWithLine } from '../../../Common';
import UserItem from '../UserItem';

interface IMemberListProps {
	onMemberSelect: (memberId: UsersClanEntity) => void;
}

export const MemberList = memo((props: IMemberListProps) => {
	const { onMemberSelect } = props;
	const { themeValue } = useTheme();
	const [searchMemberText, setSearchMemberText] = useState('');
	const clanUserList = useAppSelector(selectAllUserClans);

	const filteredMemberList = useMemo(() => {
		if (!clanUserList || clanUserList?.length === 0) {
			return [];
		}
		return clanUserList?.filter((member) => {
			return (
				normalizeString(member.user.display_name).includes(normalizeString(searchMemberText)) ||
				normalizeString(member.user.username).includes(normalizeString(searchMemberText))
			);
		});
	}, [searchMemberText, clanUserList]);

	return (
		<Block backgroundColor={themeValue.secondary} flex={1}>
			<Block paddingHorizontal={size.s_12}>
				<MezonInput value={searchMemberText} onTextChange={setSearchMemberText} placeHolder={'Search Member'} />
			</Block>
			<FlatList
				data={filteredMemberList}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={SeparatorWithLine}
				renderItem={({ item }) => {
					return <UserItem userID={item.id} onMemberSelect={onMemberSelect} />;
				}}
			/>
		</Block>
	);
});
