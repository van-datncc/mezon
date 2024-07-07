import React from 'react';
import { Text, View } from 'react-native';

import HashSignIcon from '../../../../assets/svg/channelText-white.svg';

import { FastImageRes } from './Reusables';
import { useTheme } from '@mezon/mobile-ui';
import { style } from './styles';
import { Icons } from '@mezon/mobile-components';

const WelcomeMessage = React.memo((props: { channelTitle: string; uri?: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<View style={styles.wrapperWelcomeMessage}>
			<View style={styles.iconWelcomeMessage}>
				{props.uri ? (
					<View style={{ width: 50, height: 50 }}>
						<FastImageRes uri={props.uri} />
					</View>
				) : (
					<Icons.TextIcon width={50} height={50} color={themeValue.textStrong} />
				)}
			</View>
			{!!props.channelTitle && (
				<View style={{}}>
					<Text style={styles.titleWelcomeMessage}>{'Welcome to #' + props.channelTitle}</Text>
					<Text style={styles.subTitleWelcomeMessage}>{'This is the start of the #' + props.channelTitle}</Text>
				</View>
			)}
		</View>
	);
});

export default WelcomeMessage;
