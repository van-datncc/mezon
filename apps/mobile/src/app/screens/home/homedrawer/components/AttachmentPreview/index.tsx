import { Icons, PlayIcon } from '@mezon/mobile-components';
import { baseColor, size, useTheme, verticalScale } from '@mezon/mobile-ui';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import AttachmentFilePreview from '../AttachmentFilePreview';
import { style } from './styles';

interface IProps {
	attachments: ApiMessageAttachment[];
	onRemove: (index: number) => void;
}

const AttachmentPreview = ({ attachments, onRemove }: IProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<ScrollView
			horizontal
			style={styles.container}
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ paddingRight: verticalScale(20) }}
		>
			{attachments.map((attachment, index) => {
				const isFile = !attachment?.filetype?.includes?.('video') && !attachment?.filetype?.includes?.('image');
				const isVideo = attachment?.filetype?.includes?.('video');

				return (
					<View key={index + attachment.filename} style={styles.attachmentItem}>
						{isFile ? (
							<AttachmentFilePreview attachment={attachment} />
						) : (
							<Image source={{ uri: attachment.url }} style={styles.attachmentItemImage} />
						)}

						<TouchableOpacity
							style={styles.iconClose}
							activeOpacity={0.8}
							onPress={() => onRemove(index)}
						>
							<Icons.CloseSmallBoldIcon width={size.s_18} height={size.s_18} color={baseColor.white} />
						</TouchableOpacity>

						{isVideo &&
							<View style={styles.videoOverlay}>
								<PlayIcon width={size.s_20} height={size.s_20} />
							</View>
						}
					</View>
				);
			})}
		</ScrollView>
	);
};

export default AttachmentPreview;
