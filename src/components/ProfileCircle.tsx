import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "../styles/common";

interface ProfileCircleProps {
  size?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function ProfileCircle({
  size = 40,
  onPress,
  style,
}: ProfileCircleProps) {
  const containerStyle = [
    styles.container,
    { width: size, height: size, borderRadius: size / 2 },
    style,
  ];

  const imageStyle = { width: size, height: size, borderRadius: size / 2 };

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyle} onPress={onPress}>
        <Image
          source={require("../assets/images/tomato.jpg")}
          style={imageStyle}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle}>
      <Image
        source={require("../assets/images/tomato.jpg")}
        style={imageStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: Colors.borderLight,
  },
});
