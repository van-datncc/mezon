import { size } from '@mezon/mobile-ui';
import { Image, ImageStyle } from 'react-native';
import { IconCDN } from '../../constants/icon_cdn';

type IconComponentProps = {
	icon: IconCDN;
	height?: number;
	width?: number;
	color?: string;
	customStyle?: ImageStyle | ImageStyle[];
};

const MezonIconCDN = ({ icon, height = size.s_24, width = size.s_24, color = 'white', customStyle }: IconComponentProps) => {
	return <Image source={icon} style={[{ height: height, width: width, tintColor: color }, customStyle]} resizeMode="contain" />;
};

export default MezonIconCDN;
