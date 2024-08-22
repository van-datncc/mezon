import { useTheme } from '@mezon/mobile-ui';
import { selectVoiceChannelMembersByChannelId } from '@mezon/store-mobile';
import { getSrcEmoji } from '@mezon/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from './SuggestItem.styles';

type SuggestItemProps = {
	avatarUrl?: string;
	symbol?: string;
	name: string;
	subText?: string;
	isDisplayDefaultAvatar?: boolean;
	isRoleUser?: boolean;
	emojiId?: string;
	channelId?: string
};

const SuggestItem = ({ channelId, avatarUrl, symbol, name, subText, isDisplayDefaultAvatar, isRoleUser, emojiId }: SuggestItemProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const emojiSrc = emojiId ? getSrcEmoji(emojiId) : '';
	const voiceChannelMember = useSelector(selectVoiceChannelMembersByChannelId(channelId));
	const { t } = useTranslation(['clan']);

	const checkVoiceStatus = useMemo(() => {
		if (!!channelId && voiceChannelMember) {
			return voiceChannelMember.length >= 2;
		}
		return false;
	}, [voiceChannelMember, channelId]);

	return (
		<View style={styles.wrapperItem}>
			<View style={styles.containerItem}>
				{avatarUrl ? (
					<Image
						style={styles.image}
						source={{
							uri: avatarUrl,
						}}
					/>
				) : (
					!name.startsWith('here') &&
					!isRoleUser &&
					isDisplayDefaultAvatar && (
						<View style={styles.avatarMessageBoxDefault}>
							<Text style={styles.textAvatarMessageBoxDefault}>{name?.charAt(0)?.toUpperCase()}</Text>
						</View>
					)
				)}
				{emojiSrc && <Image style={styles.emojiImage} source={{ uri: emojiSrc }} />}
				{symbol && <Text style={styles.symbol}>{symbol}</Text>}
				{isRoleUser || name.startsWith('here') ? (
					<Text style={[styles.roleText, name.startsWith('here') && styles.textHere]}>{`@${name}`}</Text>
				) : (
					<View style={styles.channelWrapper}>
						<Text style={styles.title}>{name}</Text>
						{checkVoiceStatus &&
							<Text style={styles.channelBusyText}>
								({t('busy')})
							</Text>
						}
					</View>
					
				)}
			</View>
			<Text style={styles.subText}>{subText}</Text>
		</View>
	);
};

export default SuggestItem;
