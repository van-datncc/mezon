import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  emptyBox: {
    flexDirection: "column",
    alignItems:"center",
    marginTop: size.s_60,
  },
  textEmpty: {
    marginTop: size.s_10,
    fontSize: size.label,
    color: Colors.textGray,
    textAlign: 'center'
  }
})

export default styles;
