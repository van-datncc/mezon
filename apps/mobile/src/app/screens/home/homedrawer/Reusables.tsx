import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import HashSignWhiteIcon from '../../../../assets/svg/channelText-white.svg';
import HashSignIcon from '../../../../assets/svg/channelText.svg';
import AngleDownIcon from '../../../../assets/svg/guildDropdownMenu.svg';
import SpeakerIcon from '../../../../assets/svg/speaker.svg';
import { styles } from './styles';

export const ChannelListContext = React.createContext({} as any);
export const ServerIcon = React.memo((props: { icon?: any; data: any }) => {
	return (
		<View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
			<View
				style={styles.serverIcon}
			>
				{props.icon ? props.icon : <FastImageRes uri={props.data.image} />}
			</View>
		</View>
	);
});

export const FastImageRes = React.memo(({ uri }: { uri: string }) => {
	return (
		<FastImage
			style={{ width: '100%', height: '100%' }}
			source={{
				uri: uri,
				headers: { Authorization: 'someAuthToken' },
				priority: FastImage.priority.normal,
			}}
			resizeMode={FastImage.resizeMode.cover}
		/>
	);
});

export const ChannelListHeader = React.memo((props: { title: string; onPress: any; isCollapsed: boolean }) => {
	return (
		<TouchableOpacity onPress={props?.onPress} key={Math.floor(Math.random() * 9999999).toString()} style={styles.channelListHeader}>
			<View style={styles.channelListHeaderItem}>
				<AngleDownIcon width={20} height={20} style={[props?.isCollapsed && { transform: [{ rotate: '-90deg' }] }]} />
				<Text style={styles.channelListHeaderItemTitle}>{props.title}</Text>
			</View>
		</TouchableOpacity>
	);
});

export const ChannelListSection = React.memo((props: { data: any; index: number; onPressHeader: any; collapseItems: any }) => {
	const isCollapsed = props?.collapseItems?.includes?.(props?.index?.toString?.());

	return (
		<View key={Math.floor(Math.random() * 9999999).toString()} style={styles.channelListSection}>
			<ChannelListHeader
				title={props.data.category}
				onPress={() => props?.onPressHeader?.(props?.index?.toString?.())}
				isCollapsed={isCollapsed}
			/>
			{!isCollapsed &&
				props.data.items?.map((item: any, index: number) => (
					<ChannelListItem data={item} key={Math.floor(Math.random() * 9999999).toString() + index} isNew={index % 2 === 0} />
				))}
		</View>
	);
});

export const ChannelListItem = React.memo((props: { data: any; image?: string; isNew: boolean }) => {
	const useChannelListContentIn = React.useContext(ChannelListContext);

	const handleRouteData = React.useCallback(() => {
		useChannelListContentIn.navigation.closeDrawer();
	}, []);

	return (
		<View onTouchEnd={handleRouteData} style={styles.channelListItem}>
			{props.isNew && <View style={styles.dotIsNew} />}
			{props.image != undefined ? (
				<View style={{ width: 30, height: 30, borderRadius: 50, overflow: 'hidden' }}>
					<FastImageRes uri={props.image} />
				</View>
			) : props.data.type == 'voice' ? (
				<SpeakerIcon width={20} height={20} fill={'#FFFFFF'} />
			) : props.isNew ? (
				<HashSignWhiteIcon width={18} height={18} />
			) : (
				<HashSignIcon width={18} height={18} />
			)}
			<Text style={[styles.channelListItemTitle, props.isNew && styles.channelListItemTitleActive]}>{props.data.title}</Text>
		</View>
	);
});
