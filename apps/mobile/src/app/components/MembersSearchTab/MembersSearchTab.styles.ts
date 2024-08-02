import { Attributes, size } from "@mezon/mobile-ui";
import { Dimensions, StyleSheet } from "react-native";

const style = (colors: Attributes) => StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: size.s_20,
    width: Dimensions.get("screen").width,
  },
  boxMembers: { width: '100%', marginTop: size.s_10, borderRadius: size.s_14, backgroundColor: colors.secondary }
})

export default style;
