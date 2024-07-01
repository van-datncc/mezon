import { useEffect, useState } from "react"
import { Appearance } from "react-native"
import { useSelector } from 'react-redux';
import { selectTheme } from '@mezon/store';
import { themeColors } from "../themes/Constants";
export enum ThemeModeBase {
    LIGHT = "light",
    DARK = "dark",
    DARKER = "darker",
    MIDNIGHT = "midnight",
}

export enum ThemeModeAuto {
    AUTO = "auto",
}

export type ThemeMode = ThemeModeBase | ThemeModeAuto

export function useTheme(themeMode?: ThemeMode) {
    const systemTheme = Appearance.getColorScheme() == "dark" ? ThemeModeBase.DARK : ThemeModeBase.LIGHT;
    const appearanceTheme = useSelector(selectTheme);

    const [theme, setTheme] = useState<ThemeModeBase>(
        themeMode
            ? themeMode == ThemeModeAuto.AUTO ? systemTheme : themeMode
            : appearanceTheme == "system" ? systemTheme : ThemeModeBase.LIGHT
    );

    useEffect(()=>{
        !themeMode && setTheme(appearanceTheme == "system" ? systemTheme : ThemeModeBase.LIGHT)
    },[appearanceTheme]);

    return themeColors[theme];
}