import React, { ReactNode } from 'react';
import { View, ViewStyle, Text, Modal, Pressable, ModalBaseProps } from 'react-native';
import { styles } from './style';
import Feather from 'react-native-vector-icons/Feather';

interface IMezonModalProps extends Pick<ModalBaseProps, 'animationType'> {
    visible: boolean;
    visibleChange?: (value: boolean) => void;
    title?: ReactNode | string;
    titleStyle?: ViewStyle | ViewStyle[];
    children: JSX.Element | ReactNode;
    confirmText?: string;
    onConfirm?: () => void | undefined;
    style?: ViewStyle;
}

export const MezonModal = (props: IMezonModalProps) => {
  const {
    visible,
    visibleChange,
    onConfirm = undefined,
    confirmText,
    children,
    title,
    titleStyle = {},
    style = {},
    animationType = 'slide'
  } = props;

  const setVisible = (value: boolean) => {
    if (visibleChange && typeof visibleChange === 'function') {
        visibleChange(value);
    }
  };

  const pressConfirm = () => {
    if (onConfirm && typeof onConfirm === 'function') {
        onConfirm()
    }
  }

  const isTitleString = typeof title === 'string';
  const isEmptyHeader = !title || !confirmText;

  return (
    <Modal
        visible={visible}
        animationType={animationType}
        statusBarTranslucent={true}
        >
            <View style={styles.container}>
                <View style={[styles.headerWrapper, isEmptyHeader && styles.bgDefault]}>
                    <View style={styles.headerContent}>
                        <Pressable  onPress={() => setVisible(false)}>
                            <Feather size={27} name="x" style={styles.closeIcon} />
                        </Pressable>
                        {isTitleString ?
                            <Text style={[styles.textTitle, titleStyle]}>{title}</Text>
                            :
                            <View style={titleStyle}>
                                {title}
                            </View>
                        }
                    </View>
                    {confirmText ?
                        <Pressable onPress={() => pressConfirm()}>
                            <Text style={styles.confirm}>{confirmText}</Text>
                        </Pressable>
                     : <View />
                    }
                </View>
                <View style={[styles.fill, style]}>
                    {children}
                </View>
            </View>
    </Modal>
  );
};
