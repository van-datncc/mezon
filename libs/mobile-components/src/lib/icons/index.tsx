import Svg, { Circle, Path, Rect } from 'react-native-svg';

export function OnlineStatus() {
	return (
		<Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
			<Circle cx="6" cy="6" r="6" fill="#16A34A" />
		</Svg>
	);
}

export function OfflineStatus() {
	return (
		<Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
			<Rect x="1.5" y="1.5" width="9" height="9" rx="4.5" stroke="#AEAEAE" strokeWidth="3" />
		</Svg>
	);
}

export function SmilingFaceIcon({ width = 60, height = 60 }) {
	return (
		<Svg width={width} height={height} viewBox="0 0 60 60" fill="none">
			<Path
				d="M30 5C16.192 5 5 16.192 5 30c0 13.805 11.192 25 25 25 13.807 0 25-11.195 25-25C55 16.192 43.807 5 30 5zM20 15a5 5 0 110 10 5 5 0 010-10zm25 20c0 6.542-7.15 12.5-15 12.5S15 41.542 15 35v-2.5h30V35zm-5-10a5 5 0 110-10 5 5 0 010 10z"
				fill="#c7c7c7"
			/>
		</Svg>
	);
}

export function PlusIcon({ width = 60, height = 60 }) {
	return (
		<Svg width={width} height={height} viewBox="0 0 60 60" fill="none">
			<Path d="M50 28.261H32.221V10.483h-4.445v17.778H10v4.445h17.777v17.777h4.445V32.706h17.777V28.26z" fill="#c7c7c7" />
		</Svg>
	);
}
