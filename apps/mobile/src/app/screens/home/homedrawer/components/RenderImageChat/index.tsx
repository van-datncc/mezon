import { Metrics, useAnimatedState, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { style } from './styles';

const widthMedia = Metrics.screenWidth - 150;
export const RenderImageChat = React.memo(({ image, index, disable, onPress, onLongPress }: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [calcImgHeight, setCalcImgHeight] = useAnimatedState<number>(0);

	return (
		<TouchableOpacity disabled={disable} activeOpacity={0.8} key={index} onPress={() => onPress(image)} onLongPress={onLongPress}>
			<FastImage
				style={[
					styles.imageMessageRender,
					{
						width: widthMedia,
						height: calcImgHeight,
					},
				]}
				source={{ uri: image?.url }}
				resizeMode="contain"
				onLoad={(evt) => {
					setCalcImgHeight((evt.nativeEvent.height / evt.nativeEvent.width) * widthMedia);
				}}
			/>
		</TouchableOpacity>
	);
});
