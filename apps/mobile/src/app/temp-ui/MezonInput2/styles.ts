import { Attributes, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
  label: {
    color: colors.text,
    textTransform: 'uppercase',
    paddingHorizontal: size.s_20,
  },
  input: {
    backgroundColor: colors.secondary,
    marginVertical: size.s_10,
    color: colors.textStrong,
    paddingHorizontal: size.s_20,
    paddingVertical: 0,
    height: size.s_50,
  },
  errorInput: {
    paddingHorizontal: size.s_20,
  }
})