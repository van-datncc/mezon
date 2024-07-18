import { Attributes, Metrics, size } from "@mezon/mobile-ui";
import { Dimensions, StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
  containerPinMessage: {
    width: Dimensions.get('screen').width,
    paddingHorizontal: Metrics.size.xl,
    paddingVertical: size.s_16
  }
})
