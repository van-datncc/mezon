import { Appearance } from 'react-native';

// const isDarkTheme = Appearance.getColorScheme() === 'dark';
// TODO: hardcode to check only dark theme
const isDarkTheme = true;

const colors = {
	primary: isDarkTheme ? '#000000' : '#FFFFFF',
	surface: isDarkTheme ? '#0B0B0B' : '#F7F7F7',
	secondary: isDarkTheme ? '#151515' : '#F0F0F0',
	transparent: 'rgba(0,0,0,0)',
	white: isDarkTheme ? '#FFFFFF' : '#000000',
	black: isDarkTheme ? '#000000' : '#FFFFFF',
	textGray: isDarkTheme ? '#c7c7c7' : '#c7c7c7',
	titleReset: isDarkTheme ? 'rgba(148, 154, 164, 1)' : 'rgb(44,44,45)',
	gray72: isDarkTheme ? '#727272' : '#727272',
	tertiary: isDarkTheme ? '#AEAEAE' : '#AEAEAE',
	tertiaryWeight: isDarkTheme ? '#1E1E1E' : '#E1E1E1',
	gray48: isDarkTheme ? '#484848' : '#484848',
  bgButton: isDarkTheme ? "#5865f2" : "#5865f2",
	textLink: '#007AFF',
	borderDim: isDarkTheme ? "#5a5b5c30" : "#5a5b5c30",
	test: '#676b73',
	/* border color */
	borderPrimary: '#363940',
	/* text color */
	header1: '#888c94',
	header2: '#676b73',
	/* background color */
	bgPrimary: isDarkTheme ? '#3e4247' : '#FFFFFF',
	bgViolet: isDarkTheme ? '#5a62f4' : '#5a62f4',
	bgGrayLight: '#676b73',
	bgGrayDark: '#676b73',
	bgDarkSlate: '#2a2e31',
	bgCharcoal: '#313338'

};

export default colors;
