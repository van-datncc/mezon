import { baseColor, Block, size, useTheme } from '@mezon/mobile-ui';
import { channelsActions, directActions } from '@mezon/store-mobile';
import { ChannelStreamMode } from 'mezon-js';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Text, TextStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { style } from './styles';

type BuzzBadgeProps = {
	channelId: string;
	isReset: boolean;
	senderId: string;
	mode: ChannelStreamMode;
	timestamp: number;
	customStyles?: TextStyle;
};

function BuzzBadge({ channelId, isReset, senderId, mode, timestamp, customStyles }: BuzzBadgeProps) {
	const dispatch = useDispatch();
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const isPosDmOrGr = useMemo(() => mode === ChannelStreamMode.STREAM_MODE_DM || mode === ChannelStreamMode.STREAM_MODE_GROUP, [mode]);
	const isChannelOrThread = useMemo(() => mode === ChannelStreamMode.STREAM_MODE_CHANNEL || mode === ChannelStreamMode.STREAM_MODE_THREAD, [mode]);

	const resetBuzzState = useCallback(() => {
		if (isChannelOrThread) {
			dispatch(channelsActions.setBuzzState({ channelId, buzzState: null }));
		} else if (isPosDmOrGr) {
			dispatch(directActions.setBuzzStateDirect({ channelId, buzzState: null }));
		}
	}, [dispatch, channelId, isChannelOrThread, isPosDmOrGr]);

	useEffect(() => {
		if (isReset) {
			const timer = setTimeout(resetBuzzState, 10000);
			return () => clearTimeout(timer);
		}
	}, [isReset, resetBuzzState, senderId, timestamp]);

	if (!isReset) return null;

	return (
		<Block style={customStyles} marginRight={size.s_10} backgroundColor={baseColor.buzzRed} paddingHorizontal={size.s_4} borderRadius={size.s_4}>
			<Text style={styles.textBuzz}>Buzz!!</Text>
		</Block>
	);
}

export default React.memo(BuzzBadge);
