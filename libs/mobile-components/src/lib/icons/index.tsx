import Svg, { Circle, Rect } from 'react-native-svg';

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