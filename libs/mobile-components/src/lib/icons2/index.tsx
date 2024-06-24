import { Path, Svg, SvgProps } from "react-native-svg";

export const UserCircleIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>
        <Path
            d="M467.44 704.88a33 33 0 1032.84 33 33 33 0 00-32.84-33zm.13 9A10.45 10.45 0 11457 724.16a10.29 10.29 0 0110.57-10.26zm17.48 43.94l-2.83-4.3c-.41.31-.83.48-.83.65-.13 7.82-.24 7.9-8.3 9.86a23.73 23.73 0 01-11.3 0c-8.2-2-8.33-2.06-8.5-10.28a3.7 3.7 0 00-.88 0c-1.79.43-1 5.36-4.05 2.86-2.4-1.94-5.65-4.21-2.24-8.55a27.23 27.23 0 0139.72-3c5.77 5.44 5.71 6.94-.79 12.78z"
            transform="translate(-434.46 -704.88)"
        />
    </Svg>
)

export const NittroWheelIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>
        <Path
            d="M469.85 370.06c4.43.38 9.74-.63 15 .79a23.93 23.93 0 0118.06 23.85c-.28 11.28-8.45 20.7-19.87 22.92-10.48 2-21.53-3.86-25.94-14.08-1-2.31-1.81-4-4.82-3.65a2.69 2.69 0 01-3.1-3.06c.13-2 1.58-2.77 3.46-2.8s3.66 0 5.47-.11a2.91 2.91 0 000-5.81c-1.82-.14-3.65-.08-5.48-.08-2.2 0-4.71.16-4.8-2.9s2.33-3.11 4.59-3.1h10.46c2 0 3.85-.48 4-2.78.15-2.64-1.79-3.23-4-3.22s-4.31 0-6.47 0-4.24-.46-4.16-3.09 2.21-2.92 4.35-2.91c4.1.05 8.25.03 13.25.03zM440.29 382c2.35-.06 3.95.62 4 2.92.07 2-1.18 3-3.11 3.07s-3.79-.45-4-2.68 1.3-3.15 3.11-3.31z"
            transform="translate(-434 -358)"
        />
        <Path
            d="M490.94 393.77a12 12 0 01-18.82 10.07 9.86 9.86 0 01-2.65-2.54 12 12 0 1121.47-7.53z"
            transform="translate(-434 -358)"
            fill="#fff"
        />
        <Path
            d="M484.1 397a5.18 5.18 0 01-4.89 2.91 6 6 0 01-6.11-6.11 5.95 5.95 0 0110.79-3.16 6.44 6.44 0 01.21 6.36z"
            transform="translate(-434 -358)"
        />
    </Svg>
)

// ---
export const AccessibilityIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>
        <Path d="M36.15 3.06a32.94 32.94 0 1032.76 33.09A32.83 32.83 0 0036.15 3.06zm-6 14.53a5.46 5.46 0 015.93-5.44 5.41 5.41 0 015.23 3.31 6.31 6.31 0 01-.17 5.45 5.32 5.32 0 01-5.45 3c-3.62-.25-5.82-2.64-5.55-6.32zm19.61 12.75C41.25 32.79 40 35.49 43.2 44c1.4 3.72 2.79 7.44 4.22 11.14.92 2.4 0 3.79-2.28 4.54-2-.19-2.84-1.43-3.45-3.13-1.17-3.27-2.48-6.48-3.69-9.74-.42-1.11-.78-2.39-2.2-2.27-1 .1-1.44 1.19-1.8 2.14-1.27 3.41-2.6 6.8-3.87 10.21-.69 1.86-1.7 3.54-3.93 2.72s-2.2-2.71-1.5-4.93c1.78-6 5.31-11.35 5.43-17.92.07-3.6-1.16-5.15-4.49-5.65a23.77 23.77 0 01-5.28-1.33c-1.43-.56-2.57-1.76-1.92-3.51A2.92 2.92 0 0122 24.2a21.56 21.56 0 014.33 1.05c7.38 3.1 14.63 1.63 21.85-.52 2.38-.71 4.88-1.47 5.65 1.7.65 2.91-1.97 3.3-4.07 3.91z" />
    </Svg>
)

export const ActivityIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M66 11.45v4.53a18 18 0 01-5.28 12.75l-12.3 12.3a1.5 1.5 0 00-.42 1.05V53.3a9 9 0 01-1.98 5.61l-5.37 6.72a1.5 1.5 0 01-2.58-.42l-5.58-15.06a1.498 1.498 0 00-.33-.54L21.78 39.23a1.498 1.498 0 00-.51-.33l-14.4-5.55a1.501 1.501 0 01-.45-2.55l6.06-5.19a9 9 0 015.82-2.16h11.04a1.501 1.501 0 001.08-.45l12.3-12.3a18 18 0 0112.72-5.25H60a6 6 0 016 6zm-15 15a6 6 0 100-12 6 6 0 000 12z"
        />
        <Path d="M27 56.45a3 3 0 00-3-3h-3a3 3 0 01-3-3v-3a3 3 0 00-3-3 9 9 0 00-9 9v9a3 3 0 003 3h9a9 9 0 009-9z" />
    </Svg>
)

export const AnalyticIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 57V15a9 9 0 019-9h42a9 9 0 019 9v42a9 9 0 01-9 9H15a9 9 0 01-9-9zm48-28.77V39a3 3 0 006 0V21a3 3 0 00-3-3H39a3 3 0 000 6h10.77L34.5 39.27l-5.4-5.4a3 3 0 00-4.2 0l-12 12a3 3 0 104.2 4.26L27 40.2l5.4 5.4a3 3 0 004.2 0L54 28.2v.03z"
        />
    </Svg>
)

export const AnnouncementsIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const AnnouncementsLockIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const AnnouncementsWarningIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const AppsIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ArrowAngleLeftUpIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ArrowAngleRightUpIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ArrowLargeDownIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ArrowLargeLeftIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ArrowLargeRightIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ArrowSmallDownIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ArrowSmallUpIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ArrowsUpDownIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const AtIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const AttachmentIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BackspaceIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BadgeIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BeakerIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BellIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BellSlashIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BellZIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BicycleIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BookCheckIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BoostTier2Icon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const BoostTier3Icon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const CalendarIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const CalendarMinusIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const CalendarPlusIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const CalendarXIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const CameraIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const CameraSwapIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ChannelListIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ChannelListMagnifyingGlassIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ChannelNotificationIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ChatAlertIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)

export const ChatCheckIcon = ({ width, height, color = "white", ...props }: SvgProps) => (
    <Svg viewBox="0 0 72 72" fill={color} width={width} height={height} {...props}>

    </Svg>
)