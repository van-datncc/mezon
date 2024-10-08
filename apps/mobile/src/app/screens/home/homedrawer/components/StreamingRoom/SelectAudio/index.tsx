import { Icons } from '@mezon/mobile-components';
import { Block, size, useTheme } from '@mezon/mobile-ui';
import { NotificationType } from 'mezon-js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { MezonOption } from '../../../../../../componentUI';
import { style } from './SelectAudio.styles';

export default function SelectAudio() {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['streamingRoom']);

	const optionAudio = [
		{
			title: t('selectAudioOutput.phone'),
			value: NotificationType.ALL_MESSAGE,
			icon: <Icons.PhoneHangupIcon color={themeValue.text} />
		},
		{
			title: t('selectAudioOutput.speaker'),
			value: NotificationType.MENTION_MESSAGE,
			icon: <Icons.VoiceNormalIcon color={themeValue.text} />
		}
	];
	return (
		<Block paddingHorizontal={size.s_10} paddingVertical={size.s_20}>
			<Text style={styles.title}>{t('selectAudioOutput.title')}</Text>
			<MezonOption title={'This phone'} data={optionAudio} />
		</Block>
	);
}
