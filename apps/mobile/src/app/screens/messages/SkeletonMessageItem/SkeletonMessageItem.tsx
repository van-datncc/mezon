import { Block, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { style } from './styles';

export default function SkeletonMessageItem({ numberSkeleton }: { numberSkeleton: number }) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<Block flex={1}>
			{Array.from({ length: numberSkeleton }).map((_, index) => (
				<Block key={`MessageItemSkeleton_${index}`} flexDirection="row" style={styles.messageItem}>
					<ShimmerPlaceHolder
						shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
						shimmerStyle={styles.avatar}
						LinearGradient={LinearGradient}
					/>

					<Block flex={1} justifyContent={'center'}>
						<ShimmerPlaceHolder
							shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
							shimmerStyle={styles.normalText}
							LinearGradient={LinearGradient}
						/>
						<ShimmerPlaceHolder
							shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
							shimmerStyle={styles.smallText}
							LinearGradient={LinearGradient}
						/>
					</Block>
				</Block>
			))}
		</Block>
	);
}
