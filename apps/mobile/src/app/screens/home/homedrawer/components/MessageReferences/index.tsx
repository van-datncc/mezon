import { AttachmentImageIcon, ReplyIcon } from '@mezon/mobile-components';
import { Colors, Text, useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity, UserClanProfileEntity, selectMemberByUserId, selectUserClanProfileByClanID } from '@mezon/store';
import { messagesActions, useAppDispatch } from '@mezon/store-mobile';
import { IEmoji } from '@mezon/utils';
import { ApiMessageRef } from 'mezon-js/api.gen';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { renderTextContent } from '../../constants';
import { style } from './styles';

interface IProps {
	messageReferences?: ApiMessageRef;
	preventAction: boolean;
	currentClanId: string;
	channelsEntities?: Record<string, ChannelsEntity>;
	emojiListPNG?: IEmoji[];
	clansProfile?: UserClanProfileEntity[];
	isMessageReply?: boolean;
	mode?: number;
}

export const MessageReferences = React.memo(
	({ messageReferences, preventAction, currentClanId, channelsEntities, emojiListPNG, clansProfile, mode }: IProps) => {
		const { themeValue } = useTheme();
		const styles = style(themeValue);
		const dispatch = useAppDispatch();
		const { t } = useTranslation('message');

		const clanProfileSender = useSelector(selectUserClanProfileByClanID(currentClanId as string, messageReferences?.message_sender_id as string));
		const repliedSender = useSelector(selectMemberByUserId(messageReferences?.message_sender_id || ''));

		const handleJumpToMessage = (messageId: string) => {
			dispatch(messagesActions.jumpToMessage({ messageId, channelId: currentClanId }));
		};

		return (
			<View style={styles.aboveMessage}>
				<View style={styles.iconReply}>
					<ReplyIcon width={34} height={30} />
				</View>
				<Pressable
					onPress={() => !preventAction && handleJumpToMessage(messageReferences?.message_ref_id)}
					style={styles.repliedMessageWrapper}
				>
					{repliedSender?.user?.avatar_url ? (
						<View style={styles.replyAvatar}>
							<Image source={{ uri: repliedSender?.user?.avatar_url }} style={styles.replyAvatar} />
						</View>
					) : (
						<View style={[styles.replyAvatar]}>
							<View style={styles.avatarMessageBoxDefault}>
								<Text style={styles.repliedTextAvatar}>{repliedSender?.user?.username?.charAt(0)?.toUpperCase() || 'A'}</Text>
							</View>
						</View>
					)}
					<View style={styles.replyContentWrapper}>
						<Text style={styles.replyDisplayName}>
							{clanProfileSender?.nick_name || repliedSender?.user?.display_name || repliedSender?.user?.username || 'Anonymous'}
						</Text>
						{messageReferences?.has_attachment ? (
							<>
								<Text style={styles.tapToSeeAttachmentText}>{t('tapToSeeAttachment')}</Text>
								<AttachmentImageIcon width={13} height={13} color={Colors.textGray} />
							</>
						) : (
							<>
								{renderTextContent({
									lines: messageReferences?.content ? JSON.parse(messageReferences?.content)?.t : '',
									isEdited: false,
									translate: t,
									channelsEntities,
									emojiListPNG,
									isNumberOfLine: true,
									clansProfile,
									currentClanId,
									isMessageReply: true,
									mode,
								})}
							</>
						)}
					</View>
				</Pressable>
			</View>
		);
	},
);
