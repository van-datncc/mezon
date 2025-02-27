import { Attributes, size, useTheme } from '@mezon/mobile-ui';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const ChannelListSkeleton = ({ numberSkeleton }: { numberSkeleton: number }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<View style={styles.container}>
			<View style={styles.header} />
			<View style={styles.bigText} />
			{Array.from({ length: numberSkeleton }).map((_, index) => (
				<View key={`ChannelListSkeleton_${index}`}>
					<View style={styles.normalText} />
					{index % 2 ? (
						<View>
							<View style={styles.mediumText} />
							<View style={styles.smallText} />
						</View>
					) : (
						<View>
							<View style={styles.smallText} />
							<View style={styles.smallText} />
							<View style={styles.mediumText} />
						</View>
					)}
				</View>
			))}
		</View>
	);
};

export default memo(ChannelListSkeleton);

const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingHorizontal: size.s_10
		},
		header: {
			borderRadius: size.s_8,
			height: size.s_70 * 1.5,
			marginTop: size.s_10,
			marginBottom: size.s_20,
			width: '100%',
			backgroundColor: colors.secondaryLight
		},
		bigText: { marginBottom: size.s_10, height: size.s_30, width: '100%', borderRadius: size.s_8, backgroundColor: colors.secondaryLight },
		normalText: {
			marginTop: size.s_6,
			width: 200,
			marginBottom: size.s_10,
			height: size.s_24,
			borderRadius: size.s_8,
			backgroundColor: colors.secondaryLight
		},
		smallText: {
			marginLeft: size.s_20,
			width: 100,
			marginBottom: size.s_10,
			height: size.s_16,
			borderRadius: size.s_8,
			backgroundColor: colors.secondaryLight
		},
		mediumText: {
			marginLeft: size.s_20,
			width: 150,
			marginBottom: size.s_10,
			height: size.s_16,
			borderRadius: size.s_8,
			backgroundColor: colors.secondaryLight
		},
		avatar: { width: size.s_40, height: size.s_40, borderRadius: 50 }
	});
