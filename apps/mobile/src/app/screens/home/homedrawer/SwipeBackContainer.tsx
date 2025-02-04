import { useTheme } from '@mezon/mobile-ui';
import React, { useCallback, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
const SCREEN_WIDTH = Dimensions.get('window').width;

const SwipeBackContainer = ({ children, handleBack }) => {
	const translateX = useRef(new Animated.Value(0)).current;
	const { themeValue } = useTheme();

	const onHandlerStateChange = useCallback(
		(event: { nativeEvent: { translationX: any; velocityX: any } }) => {
			const { translationX, velocityX } = event.nativeEvent;
			if (translationX > 50 && velocityX > 300) {
				Animated.timing(translateX, {
					toValue: SCREEN_WIDTH * 0.2,
					duration: 100,
					useNativeDriver: true
				}).start(() => {
					handleBack?.();
				});
			}
		},
		[handleBack, translateX]
	);
	return (
		<SafeAreaView
			edges={['top']}
			style={{
				backgroundColor: themeValue.primary,
				flex: 1
			}}
		>
			<PanGestureHandler failOffsetY={[-5, 5]} onHandlerStateChange={onHandlerStateChange}>
				<View style={{ flex: 1, backgroundColor: themeValue.primary }}>
					<Animated.View style={{ flex: 1, transform: [{ translateX }] }}>{children}</Animated.View>
				</View>
			</PanGestureHandler>
		</SafeAreaView>
	);
};

export default SwipeBackContainer;
