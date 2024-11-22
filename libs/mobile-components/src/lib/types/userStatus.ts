import { ViewStyle } from 'react-native';

export interface IUserStatusProps {
	status: IUserStatus;
	customStyles?: ViewStyle;
	iconSize?: number;
}

export interface IUserStatus {
	status?: boolean;
	isMobile?: boolean;
}
