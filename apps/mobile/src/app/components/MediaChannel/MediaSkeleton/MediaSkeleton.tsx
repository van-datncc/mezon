import { size, useTheme } from '@mezon/mobile-ui';
import React, { useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { style } from './styles';

export default function MediaSkeleton({ numberSkeleton }: { numberSkeleton: number }) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const widthScreen = Dimensions.get('screen').width;

	const widthImage = useMemo(() => {
		return widthScreen / 3 - size.s_4 * 4;
	}, [widthScreen]);
	return (
		<View style={styles.container}>
			{Array.from({ length: numberSkeleton }).map((_, index) => (
				<ShimmerPlaceHolder
					shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
					shimmerStyle={{ ...styles.normal, width: widthImage, height: widthImage }}
					LinearGradient={LinearGradient}
				/>
			))}
		</View>
	);
}
