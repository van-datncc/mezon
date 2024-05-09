import { Colors } from '@mezon/mobile-ui';
import { selectCurrentChannel } from '@mezon/store';
import { ChannelStreamMode } from 'mezon-js';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import BarsLogo from '../../../../assets/svg/bars-white.svg';
import HashSignIcon from '../../../../assets/svg/channelText-white.svg';
import SearchLogo from '../../../../assets/svg/discoverySearch-white.svg';
import ChannelMessages from './ChannelMessages';
import ChatBox from './ChatBox';
import MessageBox from './MessageBox';
import WelcomeMessage from './WelcomeMessage';
import { styles } from './styles';

const HomeDefault = React.memo((props: any) => {
	const currentChannel = useSelector(selectCurrentChannel);

	const messages = [
		{
			channelId: 1,
			datetime: '4/25/2024, 10:47:00 PM',
			message: 'ssssss',
			serverId: 1,
			user_details: { id: 1, image: 'https://unsplash.it/400/400?image=1', name: 'Paulos', user_name: 'paulos_ab' },
		},
		{
			channelId: 1,
			datetime: '4/25/2024, 10:47:02 PM',
			message: 'sssss',
			serverId: 1,
			user_details: { id: 1, image: 'https://unsplash.it/400/400?image=1', name: 'Paulos', user_name: 'paulos_ab' },
		},
		{
			channelId: 1,
			datetime: '4/25/2024, 10:47:04 PM',
			message: 'ssss',
			serverId: 1,
			user_details: { id: 1, image: 'https://unsplash.it/400/400?image=1', name: 'Paulos', user_name: 'paulos_ab' },
		},
		{
			channelId: 2,
			datetime: '4/25/2024, 10:48:22 PM',
			message: 'hello',
			serverId: 1,
			user_details: { id: 1, image: 'https://unsplash.it/400/400?image=1', name: 'Paulos', user_name: 'paulos_ab' },
		},
		{
			channelId: 2,
			datetime: '4/25/2024, 10:48:25 PM',
			message: 'hi',
			serverId: 1,
			user_details: { id: 1, image: 'https://unsplash.it/400/400?image=1', name: 'Paulos', user_name: 'paulos_ab' },
		},
	];

	return (
		<View style={[styles.homeDefault]}>
			<HomeDefaultHeader navigation={props.navigation} channelTitle={currentChannel?.channel_label} />

			<View style={{ flex: 1, backgroundColor: Colors.tertiaryWeight }}>
				{currentChannel ? (
					<ChannelMessages channelId={currentChannel.channel_id} type="CHANNEL" mode={ChannelStreamMode.STREAM_MODE_CHANNEL} />
				) : (
					<FlatList
						data={[{}]}
						contentContainerStyle={styles.listChannels}
						renderItem={() => (
							<>
								<WelcomeMessage uri={''} channelTitle={currentChannel?.channel_label || ''} serverId={1} />
								{messages
									.filter((message) => message.channelId == 2 && message.serverId == 1)
									.map((message) => (
										<MessageBox data={message} />
									))}
							</>
						)}
					/>
				)}
			</View>

			<ChatBox channelTitle={currentChannel?.channel_label || ''} channelId={2} serverId={1} />
		</View>
	);
});

const HomeDefaultHeader = React.memo(({ navigation, channelTitle }: { navigation: any; channelTitle: string }) => {
	return (
		<View style={styles.homeDefaultHeader}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<TouchableOpacity activeOpacity={0.8} style={styles.iconBar} onPress={() => navigation.openDrawer()}>
					<BarsLogo width={20} height={20} />
				</TouchableOpacity>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					{!!channelTitle && <HashSignIcon width={18} height={18} />}
					<Text style={{ color: '#FFFFFF', fontFamily: 'bold', marginLeft: 10, fontSize: 16 }}>{channelTitle}</Text>
				</View>
			</View>
			<SearchLogo width={22} height={22} style={{ marginRight: 20 }} />
		</View>
	);
});

export default HomeDefault;
