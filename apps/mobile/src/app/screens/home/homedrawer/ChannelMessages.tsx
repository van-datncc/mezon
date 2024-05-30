import { useChatMessage, useChatMessages, useChatReaction, useChatTypings, useDirectMessages } from '@mezon/core';
import { ArrowDownIcon, CloseIcon } from '@mezon/mobile-components';
import { Colors, Metrics, useAnimatedState, size } from '@mezon/mobile-ui';
import { selectAttachmentPhoto } from '@mezon/store-mobile';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, FlatList, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-view';
import ImageViewIOS from 'react-native-image-viewing';
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
	const formatAttachments: any[] = useMemo(() => {
		return attachments.map((attachment) => {
			const url = `https://cdn.mezon.vn/${attachment.clanId}/${attachment.channelId}/${attachment.filename}`;
			return {
				source: {
					uri: url,
				},
				filename: attachment.filename,
				title: attachment.filename,
				width: Metrics.screenWidth - 100,
				height: Metrics.screenHeight - 100,
				url: url,
				uri: url,
			};
		});
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

		setIdxSelectedImageModal(idx <= 0 ? 0 : idx);
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
							<TouchableOpacity
								activeOpacity={0.8}
								key={`${attachment.url}_${idx}_ImagesModal`}
								onPress={() => {
									setVisibleImageModal(false);
									setIdxSelectedImageModal(idx);
									timeOutRef.current = setTimeout(() => {
										setVisibleImageModal(true);
									}, 100);
								}}
							>
								<FastImage
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
			{visibleImageModal && <View style={styles.overlay} />}
			{Platform.OS === 'ios' ? (
				<ImageViewIOS
					backgroundColor={Colors.secondary}
					images={formatAttachments}
					imageIndex={idxSelectedImageModal}
					visible={visibleImageModal}
					onRequestClose={() => setVisibleImageModal(false)}
					FooterComponent={RenderFooterModal}
					onImageIndexChange={(idx) => setIdxSelectedImageModal(idx)}
				/>
			) : (
				<ImageView
					animationType={'none'}
					images={formatAttachments}
					imageIndex={idxSelectedImageModal}
					isVisible={visibleImageModal}
					glideAlways
					isSwipeCloseEnabled
					isPinchZoomEnabled
					isTapZoomEnabled
					onImageChange={(idx: number) => {
						setIdxSelectedImageModal(idx);
						footerImagesModalRef?.current?.scrollTo({
							y: idx * 150,
							animated: true,
						});
					}}
					controls={{
						next: true,
						prev: true,
						close: Platform.OS === 'android',
					}}
					onClose={() => setVisibleImageModal(false)}
					renderFooter={() => <RenderFooterModal />}
				/>
			)}
		</View>
	);
});

export default ChannelMessages;
