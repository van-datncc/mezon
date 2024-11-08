import { Block, size, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { style } from './styles';

export default function SkeletonThread({ numberSkeleton }: { numberSkeleton: number }) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<Block>
			<ShimmerPlaceHolder
				shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
				shimmerStyle={styles.input}
				LinearGradient={LinearGradient}
			/>
			<ShimmerPlaceHolder
				shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
				shimmerStyle={styles.bigText}
				LinearGradient={LinearGradient}
			/>
			{Array.from({ length: numberSkeleton }).map((_, index) => (
				<Block key={`ChannelListSkeleton_${index}`} flexDirection="row" justifyContent="space-between" gap={size.s_20}>
					<Block
						flex={1}
						borderRadius={size.s_10}
						flexDirection="row"
						alignItems="center"
						paddingHorizontal={size.s_10}
						marginTop={size.s_4}
					>
						{
							<Block flex={1}>
								<ShimmerPlaceHolder
									shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
									shimmerStyle={styles.normalText}
									LinearGradient={LinearGradient}
								/>
								<Block flexDirection="row" gap={size.s_20}>
									<ShimmerPlaceHolder
										shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
										shimmerStyle={styles.mediumText}
										LinearGradient={LinearGradient}
									/>
									<ShimmerPlaceHolder
										shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
										shimmerStyle={styles.smallText}
										LinearGradient={LinearGradient}
									/>
								</Block>
							</Block>
						}
						<ShimmerPlaceHolder
							shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
							shimmerStyle={{ ...styles.dropdown, width: size.s_20, height: size.s_30 }}
							LinearGradient={LinearGradient}
						/>
					</Block>
				</Block>
			))}
		</Block>
	);
}
