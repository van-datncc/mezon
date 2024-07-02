import { ThemeModeBase } from "../hooks/useTheme"

type HexColor = `#${string}`
type Colors = { [key: string]: HexColor }
export type Attributes = {
    "primary": HexColor,
    "secondary": HexColor,
    "border": HexColor,
    "text": HexColor,
    "blur_fallback": HexColor,
}

type ThemeColor = Record<ThemeModeBase, Attributes>

export const baseColor = {
    blurple: "#5e65de"
} satisfies Colors;

export const themeColors: ThemeColor = {
    dark: {
        "primary": "#1c1d22",
        "secondary": "#08ffffff",
        "border": "#2e2f34",
        "text": "#93939b",
        "blur_fallback": "#f51e1f22",
    },
    light: {
        "primary": "#f2f3f5",
        "secondary": "#ffffff",
        "border": "#cbccce",
        "text": "#5d5c64",
        "blur_fallback": "#f541434a",
    }
}