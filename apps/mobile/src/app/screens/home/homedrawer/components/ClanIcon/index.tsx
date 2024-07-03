import { memo } from "react";
import { Image, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { style } from "./styles";
import { useTheme } from "@mezon/mobile-ui";

interface IClanIconProps {
    icon?: any;
    data: any;
    onPress?: any;
    isActive?: boolean,
    clanIconStyle?: ViewStyle
}
export const ClanIcon = memo((props: IClanIconProps) => {
    const styles = style(useTheme().themeValue)
    return (
        <TouchableOpacity
            activeOpacity={props?.onPress ? 0.7 : 1}
            key={Math.floor(Math.random() * 9999999).toString() + props?.data?.clan_id}
            style={[styles.wrapperClanIcon]}
            onPress={() => {
                if (props?.onPress && props?.data?.clan_id) {
                    props?.onPress(props?.data?.clan_id);
                }
            }}
        >
            <View style={[styles.clanIcon, props?.isActive && styles.clanIconActive, props?.clanIconStyle]}>
                {props.icon ? (
                    props.icon
                ) : props?.data?.logo ? (
                    <Image source={{ uri: props.data.logo }} style={styles.logoClan} />
                ) : (
                    <Text style={styles.textLogoClanIcon}>{props?.data?.clan_name.charAt(0).toUpperCase()}</Text>
                )}
            </View>
            {props?.isActive && <View style={styles.lineActiveClan} />}
        </TouchableOpacity>
    );
});