import React, { memo } from 'react';
import { StyleSheet, ViewProps, requireNativeComponent } from 'react-native';

interface CustomImageViewProps extends ViewProps {
	url: string;
	resizeMode?: 'cover' | 'contain' | 'center';
	style?: any;
}

interface ImageNativeAndroidProps {
	url: string;
	resizeMode?: 'cover' | 'contain' | 'center';
	style?: any;
}
const CustomImageView = requireNativeComponent<CustomImageViewProps>('CustomImageView');

const ImageNativeAndroid = ({ url, style, resizeMode }: ImageNativeAndroidProps) => {
	return <CustomImageView url={url} resizeMode={resizeMode} style={style} />;
};

const styles = StyleSheet.create({});

export default memo(ImageNativeAndroid);
