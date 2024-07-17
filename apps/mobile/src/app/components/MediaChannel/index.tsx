import { Colors, Metrics, size, useAnimatedState } from '@mezon/mobile-ui';
import { selectAttachmentPhoto } from '@mezon/store-mobile';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { useSelector } from 'react-redux';
import { ImageListModal } from '../ImageListModal';
import styles from './MediaChannel.styles';
import MediaItem from './MediaItem';
import EmptyMedia from './EmptyMedia';

const MediaChannel = () => {
	const attachments = useSelector(selectAttachmentPhoto());
	const [imageSelected, setImageSelected] = useState<ApiMessageAttachment>();
	const [visibleImageModal, setVisibleImageModal] = useState<boolean>(false);
	const [idxSelectedImageModal, setIdxSelectedImageModal] = useAnimatedState<number>(0);
	const [visibleImageModalOverlay, setVisibleImageModalOverlay] = useState<boolean>(false);
	const timeOutRef = useRef(null);


	const openImage = useCallback(
		(image: ApiMessageAttachment) => {
			setImageSelected(image);
			setIdxSelectedImageModal(0);
			setVisibleImageModal(true);
		},
		[setVisibleImageModal, setIdxSelectedImageModal],
	);

	const createAttachmentObject = (attachment) => ({
		source: {
			uri: attachment.url,
		},
		filename: attachment.filename,
		title: attachment.filename,
		width: Metrics.screenWidth,
		height: Metrics.screenHeight - 150,
		url: attachment.url,
		uri: attachment.url,
		uploader: attachment.uploader,
		create_time: attachment.create_time,
	});

	const formatAttachments = useMemo(() => {
		const imageSelectedUrl = imageSelected ? createAttachmentObject(imageSelected) : {};
		const attachmentObjects = attachments?.filter((u) => u.url !== imageSelected?.url).map(createAttachmentObject);

		return [imageSelectedUrl, ...attachmentObjects];
	}, [attachments, imageSelected]);

	const onImageModalChange = useCallback(
		(idx: number) => {
			setIdxSelectedImageModal(idx);
		},
		[setIdxSelectedImageModal],
	);

	const onImageFooterChange = useCallback(
		(idx: number) => {
			setVisibleImageModal(false);
			setVisibleImageModalOverlay(true);
			setIdxSelectedImageModal(idx);
			timeOutRef.current = setTimeout(() => {
				setVisibleImageModal(true);
			}, 50);
			timeOutRef.current = setTimeout(() => {
				setVisibleImageModalOverlay(false);
			}, 500);
		},
		[setIdxSelectedImageModal, setVisibleImageModal, setVisibleImageModalOverlay],
	);

	return (
		<View>
			<ScrollView
				style={{ height: Metrics.screenHeight / (Platform.OS === 'ios' ? 1.4 : 1.3) }}
				contentContainerStyle={{ paddingBottom: size.s_50 }}
				showsVerticalScrollIndicator={false}
			>
				<View
					style={styles.container}
				>
					{attachments?.length ? (
						attachments?.map((item, index) => <MediaItem data={item} onPress={openImage} key={index} />)
					) : (
						<EmptyMedia />
					)}
				</View>
			</ScrollView>
			{visibleImageModalOverlay && (
				<View style={styles.overlay}>
					<Flow size={size.s_34 * 2} color={Colors.bgViolet} />
				</View>
			)}
			{visibleImageModal ? (
				<ImageListModal
					data={formatAttachments}
					visible={visibleImageModal}
					idxSelected={idxSelectedImageModal}
					onImageChange={onImageModalChange}
					onClose={() => setVisibleImageModal(false)}
					onImageChangeFooter={onImageFooterChange}
				/>
			) : null}
		</View>
	);
};

export default MediaChannel;
