import { Block, Colors, size, Text, useTheme } from "@mezon/mobile-ui";
import { selectLastSeenMessage } from "@mezon/store-mobile";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface INewMessageRedLineProps {
  messageId: string;
  channelId: string;
}

export const NewMessageRedLine = memo((props: INewMessageRedLineProps) => {
  const { channelId = '', messageId = '' } = props;
  const { themeValue } = useTheme();
  const { t } = useTranslation('message');
  const lastSeen = useSelector(selectLastSeenMessage(channelId, messageId));
  return (
    <Block alignItems="center">
      {lastSeen &&
        <Block
          height={1}
          width={'95%'}
          backgroundColor={Colors.red}
          margin={size.s_20}
        >
          <Block
            position="absolute"
            top={-size.s_10}
            left={0}
            justifyContent="center"
            alignItems="center"
            width={'100%'}
          >
            <Block paddingHorizontal={size.s_10} backgroundColor={themeValue.secondary}>
              <Text color={Colors.red}>{t('newMessages')}</Text>
            </Block>
          </Block>
        </Block>}
    </Block>
  )
})