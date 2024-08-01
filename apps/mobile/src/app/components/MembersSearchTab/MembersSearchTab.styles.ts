import { Colors, size } from "@mezon/mobile-ui";
import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: size.s_20,
    width: Dimensions.get("screen").width,
    paddingBottom: size.s_60,
  }
})

export default styles;
