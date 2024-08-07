import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  channelName: {
    fontSize: size.label,
    color: Colors.textGray,
    fontWeight: '600'
  },
  categoryChannel: {
    fontSize: size.label,
    color: Colors.textGray,
    fontWeight: '400'
  },
  joinChannelBtn: {
   backgroundColor: Colors.bgDarkCharcoal,
   borderRadius: size.s_30,
   paddingHorizontal: size.s_20,
   paddingVertical: size.s_8,
   flexDirection: 'row',
   alignItems: 'center',
   gap: size.s_10
  },
  joinChannelBtnText: {
    fontSize: size.label,
    color: Colors.white,
    fontWeight: '500'
  }

})

export default styles;
