import React from 'react';
import { Pressable, ViewStyle, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { Typography } from '../Typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  // Get colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.colors.primary,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'secondary':
        return {
          bg: theme.colors.secondary,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: theme.colors.primary,
          border: theme.colors.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: theme.colors.primary,
          border: 'transparent',
        };
      case 'danger':
        return {
          bg: theme.colors.danger,
          text: '#FFFFFF',
          border: 'transparent',
        };
      default:
        return {
          bg: theme.colors.primary,
          text: '#FFFFFF',
          border: 'transparent',
        };
    }
  };

  // Get size styles
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          minHeight: theme.layout.buttonSm,
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xxl,
          minHeight: theme.layout.buttonLg,
        };
      default:
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          minHeight: theme.layout.buttonMd,
        };
    }
  };

  const colors = getColors();
  const sizeStyles = getSizeStyles();

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        styles.button,
        sizeStyles,
        {
          backgroundColor: disabled ? theme.colors.textTertiary : colors.bg,
          borderColor: colors.border,
          borderWidth: variant === 'outline' ? 2 : 0,
          opacity: disabled ? 0.6 : 1,
        },
        fullWidth && styles.fullWidth,
        theme.shadows.md,
        style,
      ]}
    >
      {icon && iconPosition === 'left' && (
        <Animated.View style={styles.iconLeft}>{icon}</Animated.View>
      )}
      <Typography
        variant={size === 'sm' ? 'buttonSmall' : 'button'}
        color={disabled ? theme.colors.textSecondary : colors.text}
      >
        {title}
      </Typography>
      {icon && iconPosition === 'right' && (
        <Animated.View style={styles.iconRight}>{icon}</Animated.View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  fullWidth: {
    width: '100%',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
