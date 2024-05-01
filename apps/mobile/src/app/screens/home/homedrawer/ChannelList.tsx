import React from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import Dots from '../../../../assets/svg/guildMoreOptions1.svg';
import { darkColor } from '../../../constants/Colors';
import { useAnimatedState } from '../../../hooks/useAnimatedState';
import { Colors } from '../../../themes';
import { ChannelListContext, ChannelListSection } from './Reusables';
import { styles } from './styles';

const ChannelList = React.memo((props: any) => {
	const channelData = {
		id: 1,
		image: 'https://img.freepik.com/free-photo/glowing-spaceship-orbits-planet-starry-galaxy-generated-by-ai_188544-9655.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=sph',
		title: 'Space Explore',
		channels: [
			{
				id: 1,
				category: 'information',
				items: [
					{ id: 1, title: 'welcome-and-rules', type: 'text' },
					{ id: 2, title: 'notes-resources', type: 'text' },
				],
			},
			{
				id: 2,
				category: 'text channels',
				items: [
					{ id: 3, title: 'general', type: 'text' },
					{ id: 4, title: 'casual-chat', type: 'text' },
					{ id: 5, title: 'session-planning', type: 'text' },
					{ id: 6, title: 'off-topic', type: 'text' },
				],
			},
			{
				id: 3,
				category: 'video channels',
				items: [
					{ id: 7, title: 'video-chat', type: 'text' },
					{ id: 8, title: 'lounge', type: 'voice' },
					{ id: 9, title: 'study room 1', type: 'voice' },
					{ id: 10, title: 'study room 2', type: 'voice' },
				],
			},
		],
	};
	const [collapseChannelItems, setCollapseChannelItems] = useAnimatedState([]);

	const toggleCollapseChannel = (index: string) => {
		if (collapseChannelItems.includes(index)) {
			setCollapseChannelItems(collapseChannelItems.filter((item) => item !== index)); // Collapse if already Collapse
		} else {
			setCollapseChannelItems([...collapseChannelItems, index]); // Expand if not Collapse
		}
	};
	return (
		<ChannelListContext.Provider value={{ navigation: props.navigation }}>
			<View style={[styles.mainList, { backgroundColor: '#232323' }]}>
				<ServerListHeader title={'KOMU'} />
				<View style={styles.channelListSearch}>
					<View style={styles.channelListSearchWrapperInput}>
						<Feather size={18} name="search" style={{ color: Colors.black }} />
						<TextInput placeholder={'Search'} placeholderTextColor={Colors.textGray} style={styles.channelListSearchInput} />
					</View>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							display: 'flex',
							borderRadius: 50,
							backgroundColor: darkColor.Border_Focus,
							width: 30,
							height: 30,
						}}
					>
						<Feather size={16} name="user-plus" style={{ color: darkColor.Backgound_Subtle }} />
					</View>
				</View>
				<FlatList
					data={[...channelData.channels, ...channelData.channels]}
					renderItem={({ item, index }) => (
						<ChannelListSection data={item} index={index} onPressHeader={toggleCollapseChannel} collapseItems={collapseChannelItems} />
					)}
				/>
			</View>
		</ChannelListContext.Provider>
	);
});

const ServerListHeader = React.memo((props: { title: string }) => {
	return (
		<TouchableOpacity style={styles.listHeader}>
			<Text style={styles.titleHeaderChannel}>{props.title}</Text>
			<Dots width={30} height={30} />
		</TouchableOpacity>
	);
});

export default ChannelList;
