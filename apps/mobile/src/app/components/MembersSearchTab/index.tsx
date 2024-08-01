import { Block, Colors, size } from '@mezon/mobile-ui';
import { ChannelMembersEntity } from '@mezon/store-mobile';
import { User } from 'mezon-js';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import EmptySearchPage from '../EmptySearchPage';
import MemberItem from '../MemberStatus/MemberItem';
import { UserInformationBottomSheet } from '../UserInformationBottomSheet';
import styles from './MembersSearchTab.styles';

type MembersSearchTabProps = {
	listMemberSearch: {
		avatarUser: string;
		displayName: string;
		id: string;
		idDM: string;
		name: string;
		typeChat: number;
		user: User;
	}[];
};
const MembersSearchTab = ({ listMemberSearch }: MembersSearchTabProps) => {
	const [selectedUser, setSelectedUser] = useState<ChannelMembersEntity | null>(null);
  const handleCloseUserInfoBS = () => {
     setSelectedUser(null)
  }
	return (
		<ScrollView contentContainerStyle={styles.container}>
			{(listMemberSearch?.length > 0) ? (
				<Block width={'100%'} marginTop={size.s_10} borderRadius={size.s_14} backgroundColor={Colors.secondary}>
					{listMemberSearch?.map((user) => (
						<MemberItem
							onPress={(user) => {
								setSelectedUser(user);
							}}
							user={user as any}
							key={user?.user?.id}
						/>
					))}
				</Block>
			) : (
				<EmptySearchPage />
			)}
			<UserInformationBottomSheet user={selectedUser?.user} userId={selectedUser?.user?.id} onClose={handleCloseUserInfoBS} />
		</ScrollView>
	);
};

export default MembersSearchTab;
