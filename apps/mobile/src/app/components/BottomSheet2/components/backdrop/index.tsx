import React, { useMemo } from "react";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Colors } from "@mezon/mobile-ui";

const Backdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 0.7],
      Extrapolation.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: Colors.primary,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
    // [style]
  );

  return <Animated.View style={containerStyle} />;
};

export default Backdrop;