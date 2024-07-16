import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { View } from 'react-native';
import ChannelList from './ChannelList';
import ServerList from './ServerList';
import { style } from './styles';

const DrawerContent = React.memo((props: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<View {...props.dProps} style={[styles.containerDrawerContent, { backgroundColor: themeValue.primary }]}>
			<ServerList navigation={props.dProps.navigation} />
			<ChannelList navigation={props.dProps.navigation} />
		</View>
	);
});

export default DrawerContent;
