import { Icons } from "@mezon/mobile-components";
import { Block, size, useTheme } from "@mezon/mobile-ui";
import { memo } from "react";
import { Modal, SafeAreaView, TouchableOpacity } from "react-native";
import { ImageItem } from "../ImageListModal/ImageItem";

interface IImageModalProps {
  visible?: boolean
  onClose?: () => void;
  singleImageSelected?: string;
}

export const ImageModal = memo((props: IImageModalProps) => {
  const { visible, onClose, singleImageSelected } = props;
  const { themeValue } = useTheme();

  return (
    <Modal visible={visible}>
      <SafeAreaView style={{ flex: 1 }}>
        <Block flex={1} backgroundColor={themeValue.primary}>
          <TouchableOpacity style={{
            zIndex: 1,
            position: 'absolute',
            top: size.s_4,
            left: size.s_4,
          }} onPress={() => onClose()}>
            <Icons.CloseLargeIcon />
          </TouchableOpacity>
          <ImageItem uri={singleImageSelected} onClose={onClose} />
        </Block>
      </SafeAreaView>
    </Modal>
  )
})