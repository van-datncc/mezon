import { ActionEmitEvent } from '@mezon/mobile-components';
import { Text, size, useColorsRoleById, useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity, selectCurrentTopicInitMessage } from '@mezon/store-mobile';
import { DEFAULT_MESSAGE_CREATOR_NAME_DISPLAY_COLOR, convertTimeString } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Pressable, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonAvatar from '../../../../../../componentUI/MezonAvatar';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import { MessageAttachment } from '../../MessageAttachment';
import { RenderTextMarkdownContent } from '../../RenderTextMarkdown';
import { style } from './styles';

const NX_CHAT_APP_ANNONYMOUS_USER_ID = process.env.NX_CHAT_APP_ANNONYMOUS_USER_ID || 'anonymous';

type TopicHeaderProps = {
	mode: ChannelStreamMode;
	handleBack: () => void;
};

const TopicHeader = React.memo(({ mode, handleBack }: TopicHeaderProps) => {
	const valueTopic = useSelector(selectCurrentTopicInitMessage);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation('message');

	const isDM = useMemo(() => {
		return [ChannelStreamMode.STREAM_MODE_DM, ChannelStreamMode.STREAM_MODE_GROUP].includes(mode);
	}, [mode]);

	const checkAnonymous = useMemo(() => valueTopic?.sender_id === NX_CHAT_APP_ANNONYMOUS_USER_ID, [valueTopic?.sender_id]);

	const senderDisplayName = useMemo(() => {
		if (isDM) {
			return valueTopic?.display_name || valueTopic?.username || '';
		}
		return (
			valueTopic?.clan_nick || valueTopic?.display_name || valueTopic?.user?.username || (checkAnonymous ? 'Anonymous' : valueTopic?.username)
		);
	}, [checkAnonymous, valueTopic?.clan_nick, valueTopic?.user?.username, valueTopic?.username, valueTopic?.display_name, isDM]);

	const messageAvatar = useMemo(() => {
		if (mode === ChannelStreamMode.STREAM_MODE_CHANNEL || mode === ChannelStreamMode.STREAM_MODE_THREAD) {
			return valueTopic?.clan_avatar || valueTopic?.avatar;
		}
		return valueTopic?.avatar;
	}, [valueTopic?.clan_avatar, valueTopic?.avatar, mode]);

	const userRolesClan = useColorsRoleById(valueTopic?.sender_id || '');

	const onMention = useCallback(async (mentionedUser: string) => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_MENTION_USER_MESSAGE_ITEM, mentionedUser);
	}, []);

	const onChannelMention = useCallback(async (channel: ChannelsEntity) => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_CHANNEL_MENTION_MESSAGE_ITEM, channel);
	}, []);

	const colorSenderName = useMemo(() => {
		return (
			(userRolesClan?.highestPermissionRoleColor?.startsWith('#') ? userRolesClan.highestPermissionRoleColor : themeValue.text) ||
			DEFAULT_MESSAGE_CREATOR_NAME_DISPLAY_COLOR
		);
	}, [themeValue.text, userRolesClan.highestPermissionRoleColor]);

	return (
		<View style={styles.container}>
			<View style={styles.headerPannel}>
				<Pressable onPress={handleBack} style={styles.backButton}>
					<MezonIconCDN icon={IconCDN.arrowLargeLeftIcon} color={themeValue.text} height={size.s_20} width={size.s_20} />
				</Pressable>
				<View style={styles.titlePanel}>
					<Pressable>
						<MezonIconCDN icon={IconCDN.discussionIcon} color={themeValue.text} height={size.s_20} width={size.s_16} />
					</Pressable>
					<Text style={styles.title}>Topic</Text>
				</View>
				<View style={{ width: size.s_50 }} />
			</View>
			<View style={styles.userInfo}>
				<MezonAvatar avatarUrl={messageAvatar} username={senderDisplayName} />
				<View>
					<Text style={styles.name} color={colorSenderName}>
						{senderDisplayName}
					</Text>
					<Text style={styles.dateText}>{convertTimeString(valueTopic?.create_time)}</Text>
				</View>
			</View>
			{!valueTopic ? null : (
				<ScrollView>
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
					{valueTopic?.attachments?.length > 0 && (
						<MessageAttachment
							attachments={valueTopic?.attachments || []}
							clanId={valueTopic?.clan_id}
							channelId={valueTopic?.channel_id}
						/>
					)}
				</ScrollView>
			)}
		</View>
	);
});

export default TopicHeader;
