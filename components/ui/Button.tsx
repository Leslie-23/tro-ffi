import { colors } from "@/constants/colors";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};

    // Variant styles
    switch (variant) {
      case "primary":
        buttonStyle = {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
        break;
      case "secondary":
        buttonStyle = {
          backgroundColor: colors.secondary,
          borderWidth: 0,
        };
        break;
      case "outline":
        buttonStyle = {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary,
        };
        break;
      case "ghost":
        buttonStyle = {
          backgroundColor: "transparent",
          borderWidth: 0,
        };
        break;
      case "danger":
        buttonStyle = {
          backgroundColor: colors.error,
          borderWidth: 0,
        };
        break;
    }

    // Size styles
    switch (size) {
      case "small":
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 6,
        };
        break;
      case "medium":
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        };
        break;
      case "large":
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 10,
        };
        break;
    }

    // Width style
    if (fullWidth) {
      buttonStyle.width = "100%";
    }

    // Disabled style
    if (disabled || isLoading) {
      buttonStyle.opacity = 0.6;
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    let style: TextStyle = {
      fontWeight: "600",
      textAlign: "center",
    };

    // Size styles
    switch (size) {
      case "small":
        style.fontSize = 14;
        break;
      case "medium":
        style.fontSize = 16;
        break;
      case "large":
        style.fontSize = 18;
        break;
    }

    // Variant styles
    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        style.color = colors.white;
        break;
      case "outline":
        style.color = colors.primary;
        break;
      case "ghost":
        style.color = colors.primary;
        break;
    }

    return style;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[styles.button, getButtonStyle(), style]}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? colors.primary
              : colors.white
          }
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontWeight: "600",
  },
});
