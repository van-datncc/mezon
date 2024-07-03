import { Block, Colors, size } from '@mezon/mobile-ui';
import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const MessageItemSkeleton = ({ skeletonNumber }: { skeletonNumber: number }) => {
	return (
		<>
			{Array.from({ length: skeletonNumber }).map((_, index) => (
				<Block style={styles.wrapper} key={index}>
					<ShimmerPlaceHolder
						shimmerColors={[Colors.secondaryLight, Colors.darkCharcoalGray, Colors.jetBlack]}
						shimmerStyle={styles.avatar}
						LinearGradient={LinearGradient}
					/>

					<Block>
						<ShimmerPlaceHolder
							width={100}
							shimmerColors={[Colors.secondaryLight, Colors.darkCharcoalGray, Colors.jetBlack]}
							shimmerStyle={styles.bigText}
							LinearGradient={LinearGradient}
						/>
						<ShimmerPlaceHolder
							width={200}
							shimmerColors={[Colors.secondaryLight, Colors.darkCharcoalGray, Colors.jetBlack]}
							shimmerStyle={styles.normalText}
							LinearGradient={LinearGradient}
						/>
						{index % 2 ? (
							<ShimmerPlaceHolder
								width={300}
								shimmerColors={[Colors.secondaryLight, Colors.darkCharcoalGray, Colors.jetBlack]}
								shimmerStyle={styles.normalText}
								LinearGradient={LinearGradient}
							/>
						) : null}
					</Block>
				</Block>
			))}
		</>
	);
};
export default MessageItemSkeleton;

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		gap: size.s_14,
		marginBottom: size.s_20,
		paddingHorizontal: size.s_10,
	},
	avatar: { width: size.s_40, height: size.s_40, borderRadius: 50 },
	bigText: { marginBottom: size.s_10, height: size.s_16, borderRadius: size.s_8 },
	normalText: { height: size.s_16, borderRadius: size.s_6, marginBottom: size.s_10 },
});
