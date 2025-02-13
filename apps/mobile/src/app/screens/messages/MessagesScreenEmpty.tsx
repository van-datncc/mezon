import { RootState } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import UserEmptyMessage from '../home/homedrawer/UserEmptyClan/UserEmptyMessage';
import SkeletonMessageItem from './SkeletonMessageItem';

const MessagesScreenEmpty = memo(() => {
	const navigation = useNavigation<any>();
	const loadingStatus = useSelector((state: RootState) => state?.direct?.loadingStatus);

	const navigateToAddFriendScreen = () => {
		navigation.navigate(APP_SCREEN.FRIENDS.STACK, { screen: APP_SCREEN.FRIENDS.ADD_FRIEND });
	};
	return (
		<View>
			{loadingStatus === 'loaded' ? (
				<UserEmptyMessage
					onPress={() => {
						navigateToAddFriendScreen();
					}}
				/>
			) : loadingStatus === 'loading' ? (
				<SkeletonMessageItem numberSkeleton={10} />
			) : (
				<View />
			)}
		</View>
	);
});

export default MessagesScreenEmpty;
