import { Metrics, size, useTheme } from '@mezon/mobile-ui';
import { AttachmentEntity, selectAllListDocumentByChannel } from '@mezon/store-mobile';
import { memo } from 'react';
import { Platform, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import ChannelFileItem from './ChannelFileItem';
import { style } from './styles';

const ChannelFiles = memo(({ currentChannelId }: { currentChannelId: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const allAttachments = useSelector(selectAllListDocumentByChannel(currentChannelId));

	const renderItem = ({ item }: { item: AttachmentEntity }) => {
		return <ChannelFileItem file={item} />;
	};

	return (
		<ScrollView
			style={{ height: Metrics.screenHeight / (Platform.OS === 'ios' ? 1.4 : 1.3) }}
			contentContainerStyle={{ paddingBottom: size.s_50 }}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.container}>
				<FlatList data={allAttachments} renderItem={renderItem} />
			</View>
		</ScrollView>
	);
});

export default ChannelFiles;
