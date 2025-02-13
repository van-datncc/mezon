import { Attributes, size, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const ChannelListSkeleton = ({ numberSkeleton }: { numberSkeleton: number }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<View style={{ paddingHorizontal: size.s_10 }}>
			<View style={{ gap: size.s_10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<ShimmerPlaceHolder
					shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
					shimmerStyle={styles.bigText}
					LinearGradient={LinearGradient}
				/>
			</View>
			{Array.from({ length: numberSkeleton }).map((_, index) => (
				<View key={`ChannelListSkeleton_${index}`}>
					<ShimmerPlaceHolder
						shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
						shimmerStyle={styles.normalText}
						LinearGradient={LinearGradient}
					/>
					{index % 2 ? (
						<View>
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
						</View>
					) : (
						<View>
							<ShimmerPlaceHolder
								shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
								shimmerStyle={styles.smallText}
								LinearGradient={LinearGradient}
							/>
							<ShimmerPlaceHolder
								shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
								shimmerStyle={styles.smallText}
								LinearGradient={LinearGradient}
							/>
							<ShimmerPlaceHolder
								shimmerColors={[themeValue.secondaryLight, themeValue.charcoal, themeValue.jet]}
								shimmerStyle={styles.mediumText}
								LinearGradient={LinearGradient}
							/>
						</View>
					)}
				</View>
			))}
		</View>
	);
};

export default ChannelListSkeleton;

const style = (colors: Attributes) =>
	StyleSheet.create({
		bigText: { marginBottom: size.s_10, height: size.s_30, width: '100%', borderRadius: size.s_8 },
		normalText: { marginTop: size.s_6, width: 200, marginBottom: size.s_10, height: size.s_24, borderRadius: size.s_8 },
		smallText: { marginLeft: size.s_20, width: 100, marginBottom: size.s_10, height: size.s_16, borderRadius: size.s_8 },
		mediumText: { marginLeft: size.s_20, width: 150, marginBottom: size.s_10, height: size.s_16, borderRadius: size.s_8 },
		avatar: { width: size.s_40, height: size.s_40, borderRadius: 50 }
	});
