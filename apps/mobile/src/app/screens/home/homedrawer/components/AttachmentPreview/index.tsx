import {CloseIcon, PlayIcon} from '@mezon/mobile-components';
import { size } from '@mezon/mobile-ui';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';
import styles from './styles';

interface IProps {
	attachments: ApiMessageAttachment[];
	onRemove: (url: string) => void;
	
}

const AttachmentPreview = ({ attachments, onRemove }: IProps) => {
	
	return (
		<ScrollView horizontal style={styles.container}>
			{attachments.map((attachment, index) => {
				const isVideo = attachment.filetype.includes('video');
				return (
					<View key={index + attachment.filename} style={styles.attachmentItem}>
						<Image source={{ uri: attachment.url }} style={styles.attachmentItemImage} />
						<TouchableOpacity style={styles.iconClose} activeOpacity={0.8} onPress={() => onRemove(attachment.url ?? '')}>
							<CloseIcon width={size.s_18} height={size.s_18} color={colors.black} />
						</TouchableOpacity>
						{isVideo && (
							<View style={styles.videoOverlay}>
								<PlayIcon width={size.s_20} height={size.s_20} />
							</View>
						)}
					</View>
				)
			})}
		</ScrollView>
	);
};

export default AttachmentPreview;
