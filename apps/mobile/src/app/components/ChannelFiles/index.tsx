import { size } from '@mezon/mobile-ui';
import { AttachmentEntity, selectAllListDocumentByChannel, useAppSelector } from '@mezon/store-mobile';
import { FlashList } from '@shopify/flash-list';
import { memo, useMemo, useState } from 'react';
import { View } from 'react-native';
import { normalizeString } from '../../utils/helpers';
import ChannelFileItem from './ChannelFileItem';
import ChannelFileSearch from './ChannelFileSearch';
import { style } from './styles';

const ChannelFiles = memo(({ currentChannelId }: { currentChannelId: string }) => {
	const styles = style();
	const [searchText, setSearchText] = useState('');
	const allAttachments = useAppSelector((state) => selectAllListDocumentByChannel(state, (currentChannelId ?? '') as string));

	const filteredAttachments = useMemo(() => {
		return allAttachments.filter((attachment) => normalizeString(attachment?.filename).includes(normalizeString(searchText)));
	}, [allAttachments, searchText]);

	const renderItem = ({ item }: { item: AttachmentEntity }) => {
		return <ChannelFileItem file={item} />;
	};

	const handleSearchChange = (text: string) => {
		setSearchText(text);
	};

	return (
		<View style={{ flex: 1 }}>
			<ChannelFileSearch onSearchTextChange={handleSearchChange} />

			<View style={styles.container}>
				<FlashList
					data={filteredAttachments}
					renderItem={renderItem}
					keyExtractor={(item, index) => `attachment_document_${index}_${item?.id}`}
					estimatedItemSize={size.s_34 * 2}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
					removeClippedSubviews={true}
				/>
			</View>
		</View>
	);
});

export default ChannelFiles;
