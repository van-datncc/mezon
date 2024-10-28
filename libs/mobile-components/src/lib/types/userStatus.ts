import { ViewStyle } from 'react-native';

export interface IUserStatusProps {
	status: IUserStatus;
	customStyles?: ViewStyle;
}

export interface IUserStatus {
	status?: boolean;
	isMobile?: boolean;
}
