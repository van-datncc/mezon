import { useTheme } from '@mezon/mobile-ui';
import { IButtonMessage, IMessageActionRow } from '@mezon/utils';
import { memo } from 'react';
import { View } from 'react-native';
import { EmbedComponentItem } from './EmbedComponentItem';
import { style } from './styles';

type MessageActionsPanelProps = {
	actionRow: IMessageActionRow;
	messageId: string;
	senderId: string;
	channelId: string;
};

export const EmbedComponentsPanel = memo(({ actionRow, messageId, senderId, channelId }: MessageActionsPanelProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<View style={styles.actionPanel}>
			{!!actionRow?.components?.length &&
				actionRow?.components?.map((component) => (
					<EmbedComponentItem
						key={component.id}
						button={component?.component as IButtonMessage}
						messageId={messageId}
						senderId={senderId}
						buttonId={component.id}
						channelId={channelId}
					/>
				))}
		</View>
	);
});
