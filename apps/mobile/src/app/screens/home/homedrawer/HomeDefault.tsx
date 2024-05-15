import { Colors } from '@mezon/mobile-ui';
import { selectCurrentChannel } from '@mezon/store';
import { ChannelStreamMode } from 'mezon-js';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import BarsLogo from '../../../../assets/svg/bars-white.svg';
import HashSignIcon from '../../../../assets/svg/channelText-white.svg';
import ChannelMessages from './ChannelMessages';
import ChatBox from './ChatBox';
import { styles } from './styles';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { SearchIcon } from '@mezon/mobile-components';


const HomeDefault = React.memo((props: any) => {
	const currentChannel = useSelector(selectCurrentChannel);

	return (
		<View style={[styles.homeDefault]}>
			<HomeDefaultHeader navigation={props.navigation} channelTitle={currentChannel?.channel_label} />

			{currentChannel && (
				<View style={{ flex: 1, backgroundColor: Colors.tertiaryWeight }}>
					<ChannelMessages
						channelId={currentChannel.channel_id}
						type="CHANNEL"
						channelLabel={currentChannel?.channel_label}
						mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
					/>
					<ChatBox
						channelId={currentChannel.channel_id}
						channelLabel={currentChannel?.channel_label || ''}
						mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
					/>
				</View>
			)}
		</View>
	);
});

const HomeDefaultHeader = React.memo(({ navigation, channelTitle }: { navigation: any; channelTitle: string }) => {
	const navigateMenuThreadDetail = () => {
		navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.BOTTOM_SHEET });
	}
	return (
		<View style={styles.homeDefaultHeader}>
			<TouchableOpacity style={{ flex: 1 }} onPress={navigateMenuThreadDetail}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity activeOpacity={0.8} style={styles.iconBar} onPress={() => {
						navigation.openDrawer()
					}}>
						<BarsLogo width={20} height={20} />
					</TouchableOpacity>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						{!!channelTitle && <HashSignIcon width={18} height={18} />}
						<Text style={{ color: '#FFFFFF', fontFamily: 'bold', marginLeft: 10, fontSize: 16 }}>{channelTitle}</Text>
					</View>
				</View>
			</TouchableOpacity>
			<SearchIcon width={22} height={22} style={{ marginRight: 20 }} />
		</View>
	);
});

export default HomeDefault;
