import { Icons } from '@mezon/mobile-components';
import { Block, size, Text, useTheme } from '@mezon/mobile-ui';
import { messagesActions, MessagesEntity, selectAllChannelMemberIds, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { convertTimeString, ETokenMessage, TypeMessage } from '@mezon/utils';
import React, { memo, useCallback, useMemo } from 'react';
import { style } from './styles';

export const MessageLineSystem = memo(({ message }: { message: MessagesEntity }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { mentions = [] } = message;
	const { t } = message?.content ?? {};

	const getMemberIds = useAppSelector((state) => selectAllChannelMemberIds(state, message?.channel_id as string));

	const messageTime = convertTimeString(message?.create_time as string);
	const findThreadInText = (text: string) => {
		const threadRegex = /started a thread: ([^.]+)/;
		const match = text?.match(threadRegex);
		return match
			? {
					s: match?.index + match[0].indexOf(match[1]),
					e: match?.index + match[0].indexOf(match[1]) + match[1]?.length,
					kindOf: ETokenMessage.HASHTAGS
				}
			: null;
	};

	const findMessageInText = (text: string) => {
		const messageRegex = /a message/;
		const match = text?.match(messageRegex);
		return match
			? {
					s: match?.index,
					e: match?.index + match[0]?.length,
					kindOf: ETokenMessage.LINKS
				}
			: null;
	};

	const elements = useMemo(() => {
		const elements = [...mentions.map((item) => ({ ...item, kindOf: ETokenMessage.MENTIONS }))]?.sort((a, b) => (a.s ?? 0) - (b.s ?? 0));

		const threadInfo = findThreadInText(t);

		if (threadInfo) {
			elements.push(threadInfo);
		}

		const messageInfo = findMessageInText(t);
		if (messageInfo) {
			elements.push(messageInfo);
		}
		return elements;
	}, [mentions, t]);

	const dispatch = useAppDispatch();
	const allUserIdsInChannel = getMemberIds;
	const handleJumpToPinMessage = useCallback(
		(e) => {
			if (message?.references && message?.references[0]?.message_ref_id) {
				dispatch(
					messagesActions.jumpToMessage({
						clanId: message?.clan_id || '',
						messageId: message?.references[0]?.message_ref_id,
						channelId: message?.channel_id
					})
				);
			}
		},
		[dispatch, message?.channel_id, message?.clan_id, message?.references]
	);
	const content = useMemo(() => {
		const formattedContent = [];
		let lastIndex = 0;

		const renderElement = (element, contentInElement, index) => {
			switch (element.kindOf) {
				case ETokenMessage.MENTIONS:
					if (element.user_id) {
						formattedContent.push(
							allUserIdsInChannel?.includes(element?.user_id) || contentInElement === '@here' ? (
								<Text style={styles.textMention} key={`mention-${index}`}>
									{contentInElement}
								</Text>
							) : (
								<Text key={`plain-${index}`}>{contentInElement}</Text>
							)
						);
					}
					break;

				case ETokenMessage.HASHTAGS:
					formattedContent.push(
						<Text style={styles.textMention} key={`hashtag-${index}`}>
							{contentInElement}
						</Text>
					);
					break;

				case ETokenMessage.LINKS:
					formattedContent.push(
						<Text onPress={handleJumpToPinMessage} style={styles.textPinMessage} key={`link-${index}`}>
							{contentInElement}
						</Text>
					);
					break;
				default:
					formattedContent.push(
						<Text onPress={handleJumpToPinMessage} style={styles.textPinMessage} key={`link-${index}`}>
							{''}
						</Text>
					);
					break;
			}
		};

		elements?.forEach((element, index) => {
			const s = element?.s ?? 0;
			const e = element?.e ?? 0;
			const contentInElement = t?.substring(s, e);

			if (lastIndex < s) {
				formattedContent.push(<Text key={`text-${index}`}>{t?.slice(lastIndex, s) ?? ''}</Text>);
			}

			renderElement(element, contentInElement, index);
			lastIndex = e;
		});

		if (lastIndex < (t?.length ?? 0)) {
			formattedContent.push(<Text key="remaining">{t?.slice(lastIndex) ?? ''}</Text>);
		}

		return formattedContent;
	}, [elements, t, allUserIdsInChannel, styles, handleJumpToPinMessage]);

	return (
		<Block style={styles.wrapperMessageBox} marginVertical={size.s_10}>
			<Block marginLeft={size.s_10}>
				{message?.code === TypeMessage.Welcome && <Icons.WelcomeIcon />}
				{message?.code === TypeMessage.CreateThread && <Icons.ThreadIcon color={themeValue.text} width={size.s_20} height={size.s_20} />}
				{message?.code === TypeMessage.CreatePin && <Icons.PinIcon color={themeValue.text} width={size.s_20} height={size.s_20} />}
			</Block>
			<Block style={styles.messageSystemBox}>
				<Text style={styles.messageText}>
					{content}
					<Text style={styles.messageTime}>{` ${messageTime}`}</Text>
				</Text>
			</Block>
		</Block>
	);
});
