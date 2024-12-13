import { ActionEmitEvent } from '@mezon/mobile-components';
import { Block, size, Text, useColorsRoleById, useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity, selectValueTopic } from '@mezon/store-mobile';
import { convertTimeString, DEFAULT_MESSAGE_CREATOR_NAME_DISPLAY_COLOR } from '@mezon/utils';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter } from 'react-native';
import { useSelector } from 'react-redux';
import { MezonAvatar } from '../../../../../../componentUI';
import { MessageAttachment } from '../../MessageAttachment';
import { RenderTextMarkdownContent } from '../../RenderTextMarkdown';
import { style } from './styles';

export default function TopicHeader() {
	const valueTopic = useSelector(selectValueTopic);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation('message');

	const userRolesClan = useColorsRoleById(valueTopic?.sender_id || '');

	const onMention = useCallback(async (mentionedUser: string) => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_MENTION_USER_MESSAGE_ITEM, mentionedUser);
	}, []);

	const onChannelMention = useCallback(async (channel: ChannelsEntity) => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_CHANNEL_MENTION_MESSAGE_ITEM, channel);
	}, []);

	const colorSenderName = useMemo(() => {
		return userRolesClan.highestPermissionRoleColor || DEFAULT_MESSAGE_CREATOR_NAME_DISPLAY_COLOR;
	}, [userRolesClan.highestPermissionRoleColor]);

	return (
		<Block paddingHorizontal={size.s_10} marginVertical={size.s_10}>
			<Block flexDirection="row" alignItems="center" gap={size.s_10} margin={size.s_10}>
				<MezonAvatar avatarUrl={valueTopic?.avatar} username={valueTopic?.clan_nick} />
				<Block>
					<Text style={styles.name} color={colorSenderName}>
						{valueTopic?.clan_nick}
					</Text>
					<Text style={styles.dateText}>{convertTimeString(valueTopic?.create_time)}</Text>
				</Block>
			</Block>
			<RenderTextMarkdownContent
				content={{
					...(typeof valueTopic.content === 'object' ? valueTopic.content : {}),
					mentions: valueTopic.mentions
				}}
				translate={t}
				isMessageReply={false}
				onMention={onMention}
				onChannelMention={onChannelMention}
			/>
			<MessageAttachment message={valueTopic} />
		</Block>
	);
}
