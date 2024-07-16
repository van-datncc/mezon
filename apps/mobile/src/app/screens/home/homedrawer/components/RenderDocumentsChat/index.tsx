import { FileIcon } from '@mezon/mobile-components';
import { Colors, Text, useTheme, verticalScale } from '@mezon/mobile-ui';
import { notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { openUrl } from 'react-native-markdown-display';
import { isImage, isVideo } from '../../../../../utils/helpers';
import { RenderImageChat } from '../RenderImageChat';
import { RenderVideoChat } from '../RenderVideoChat';
import { style } from './styles';

export const RenderDocumentsChat = React.memo(({ document, onLongPress, onPressImage }: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const isShowImage = isImage(document?.url?.toLowerCase());
	if (isShowImage) {
		const checkImage = notImplementForGifOrStickerSendFromPanel(document);

		return <RenderImageChat disable={checkImage} image={document} onPress={onPressImage} onLongPress={onLongPress} />;
	}
	const checkIsVideo = isVideo(document?.url?.toLowerCase());

	if (checkIsVideo) {
		return <RenderVideoChat videoURL={document.url} />;
	}

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={() => openUrl(document.url)} onLongPress={onLongPress}>
			<View style={styles.fileViewer}>
				<FileIcon width={verticalScale(30)} height={verticalScale(30)} color={Colors.bgViolet} />
				<View style={{ maxWidth: '75%' }}>
					<Text style={styles.fileName} numberOfLines={2}>
						{document.filename}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
});
