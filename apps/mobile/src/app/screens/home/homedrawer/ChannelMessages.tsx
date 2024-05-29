import { useChatMessage, useChatMessages, useChatReaction, useChatTypings, useDirectMessages } from '@mezon/core';
import { ArrowDownIcon, CloseIcon } from '@mezon/mobile-components';
import { Colors, size, useAnimatedState } from '@mezon/mobile-ui';
import { selectAttachmentPhoto } from '@mezon/store-mobile';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IImageInfo } from 'react-native-image-zoom-viewer/src/image-viewer.type';
import { useSelector } from 'react-redux';
import MessageItem from './MessageItem';
import WelcomeMessage from './WelcomeMessage';
import { styles } from './styles';
import { ChannelStreamMode } from 'mezon-js';

type ChannelMessagesProps = {
	channelId: string;
	type: string;
	channelLabel?: string;
	avatarDM?: string;
	mode: ChannelStreamMode;
};

const ChannelMessages = React.memo(({ channelId, channelLabel, type, mode }: ChannelMessagesProps) => {
	const { messages, unreadMessageId, lastMessageId, hasMoreMessage, loadMoreMessage } = useChatMessages({ channelId });
	const { typingUsers } = useChatTypings({ channelId, channelLabel, mode });
	const { markMessageAsSeen } = useChatMessage(unreadMessageId);
	const [showScrollToBottomButton, setShowScrollToBottomButton] = useAnimatedState(false);
	const flatListRef = useRef(null);
	const footerImagesModalRef = useRef(null);
	const timeOutRef = useRef(null);
	const attachments = useSelector(selectAttachmentPhoto());
	const formatAttachments: IImageInfo[] = useMemo(() => {
		const data = attachments.map((attachment) => {
			const url = `https://cdn.mezon.vn/${attachment.clanId}/${attachment.channelId}/${attachment.filename}`;
			return {
				filename: attachment.filename,
				url: url,
			};
		});
		return data;
	}, [attachments]);
	const [visibleImageModal, setVisibleImageModal] = useAnimatedState<boolean>(false);
	const [idxSelectedImageModal, setIdxSelectedImageModal] = useAnimatedState<number>(0);

	useEffect(() => {
		if (flatListRef.current) {
			flatListRef.current.scrollToEnd({ animated: true });
		}

		return () => {
			if (timeOutRef?.current) clearTimeout(timeOutRef.current);
		};
	}, []);

	const { dataReactionCombine } = useChatReaction();

	const typingLabel = useMemo(() => {
		if (typingUsers.length === 1) {
			return `${typingUsers[0].user?.username} is typing...`;
		}
		if (typingUsers.length > 1) {
			return 'Several people are typing...';
		}
		return '';
	}, [typingUsers]);

	useEffect(() => {
		if (messages?.[0]) {
			markMessageAsSeen(messages?.[0]);
		}
	}, [markMessageAsSeen, messages]);

	const [isLoadMore, setIsLoadMore] = React.useState<boolean>(false);
	const onLoadMore = () => {
		setIsLoadMore(true);
		loadMoreMessage().finally(() => setIsLoadMore(false));
	};

	const handleScroll = (event: { nativeEvent: { contentOffset: { y: any } } }) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		const threshold = 300; // Adjust this value to determine when to show the button

		if (offsetY > threshold && !showScrollToBottomButton) {
			setShowScrollToBottomButton(true);
		} else if (offsetY <= threshold && showScrollToBottomButton) {
			setShowScrollToBottomButton(false);
		}
	};

	const scrollToBottom = () => {
		flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
	};

	const ViewLoadMore = () => {
		return (
			<View style={styles.loadMoreChannelMessage}>
				<ActivityIndicator size="large" color={Colors.tertiary} />
			</View>
		);
	};

	const getIndexAttachments = (url: string) => {
		const idx = formatAttachments?.findIndex((item) => item.url?.toString() === url?.toString());

		setIdxSelectedImageModal(idx);
		timeOutRef.current = setTimeout(() => {
			footerImagesModalRef?.current?.scrollTo({
				y: idx * 50,
				animated: true,
			});
		}, 500);
	};

	const onOpenImage = (image: ApiMessageAttachment) => {
		getIndexAttachments(image.url);
		setVisibleImageModal(true);
	};

	const renderItem = useCallback(
		({ item, index }) => {
			return (
				<MessageItem
					message={item}
					mode={mode}
					channelId={channelId}
					dataReactionCombine={dataReactionCombine}
					channelLabel={channelLabel}
					preMessage={messages.length > 0 ? messages[index + 1] : undefined}
					onOpenImage={onOpenImage}
				/>
			);
		},
		[dataReactionCombine, messages],
	);

	const RenderFooterModal = () => {
		return (
			<View style={styles.wrapperFooterImagesModal}>
				<ScrollView ref={footerImagesModalRef} horizontal showsHorizontalScrollIndicator={false} style={styles.footerImagesModal}>
					{formatAttachments?.map((attachment, idx) => {
						return (
							<TouchableOpacity key={idx} activeOpacity={0.8} onPress={() => setIdxSelectedImageModal(idx)}>
								<FastImage
									key={`${attachment.url}_${idx}_ImagesModal`}
									style={[styles.imageFooterModal, idx === idxSelectedImageModal && styles.imageFooterModalActive]}
									source={{
										uri: attachment.url,
										priority: FastImage.priority.normal,
									}}
									resizeMode={FastImage.resizeMode.cover}
								/>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>
		);
	};

	const RenderHeaderModal = () => {
		return (
			<TouchableOpacity activeOpacity={0.8} style={styles.headerImagesModal} onPress={() => setVisibleImageModal(false)}>
				<CloseIcon width={size.s_30} height={size.s_30} color={Colors.tertiary} />
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.wrapperChannelMessage}>
			{!messages?.length && <WelcomeMessage channelTitle={channelLabel} />}
			<FlatList
				ref={flatListRef}
				inverted
				data={messages || []}
				onScroll={handleScroll}
				keyboardShouldPersistTaps={'handled'}
				contentContainerStyle={styles.listChannels}
				renderItem={renderItem}
				keyExtractor={(item) => `${item?.id}`}
				windowSize={10}
				removeClippedSubviews={true}
				maxToRenderPerBatch={20}
				updateCellsBatchingPeriod={50}
				onEndReached={onLoadMore}
				onEndReachedThreshold={0.5}
				ListFooterComponent={isLoadMore && hasMoreMessage ? <ViewLoadMore /> : null}
			/>
			{showScrollToBottomButton && (
				<TouchableOpacity style={styles.btnScrollDown} onPress={scrollToBottom} activeOpacity={0.8}>
					<ArrowDownIcon color={Colors.tertiary} />
				</TouchableOpacity>
			)}
			{!!typingLabel && <Text style={styles.typingLabel}>{typingLabel}</Text>}
			{visibleImageModal && (
				<View style={{ flex: 1 }}>
					<Modal animationType="slide" transparent={true} visible={visibleImageModal}>
						<ImageViewer
							style={{ flex: 1, backgroundColor: Colors.secondary }}
							imageUrls={formatAttachments}
							index={idxSelectedImageModal}
							show={visibleImageModal}
							renderFooter={RenderFooterModal}
							renderHeader={RenderHeaderModal}
							renderIndicator={() => <View />}
							onChange={(idx) => {
								setIdxSelectedImageModal(idx);
								footerImagesModalRef?.current?.scrollTo({
									y: idx * 150,
									animated: true,
								});
							}}
							renderImage={(props) => {
								return (
									<FastImage
										key={`${props.source.uri}_ImageViewModal`}
										style={{ flex: 1 }} // Apply your desired styles
										source={{ uri: props.source.uri }}
										resizeMode="contain"
									/>
								);
							}}
						/>
					</Modal>
				</View>
			)}
		</View>
	);
});

export default ChannelMessages;
