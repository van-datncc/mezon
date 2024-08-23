import { useCheckVoiceStatus } from '@mezon/core';
import { useTheme } from '@mezon/mobile-ui';
import { getSrcEmoji } from '@mezon/utils';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
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
	const { t } = useTranslation(['clan']);

	const isVoiceActive = useCheckVoiceStatus(channelId);
	
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
						{isVoiceActive &&
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
