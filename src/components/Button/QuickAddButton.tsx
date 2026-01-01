import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { Typography } from '../Typography';
import { GlassIcon, BottleIcon, JugIcon, DropIcon, PlusIcon } from '../../assets/icons/WaterIcons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type IconType = 'glass' | 'bottle' | 'jug' | 'custom';

interface QuickAddButtonProps {
  amount: number;
  icon: IconType;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  amount,
  icon,
  onPress,
  size = 'md',
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const bounce = useSharedValue(0);

  const handlePress = () => {
    // Bouncy animation
    scale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 400 }),
      withSpring(1.05, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 12, stiffness: 400 })
    );
    bounce.value = withSequence(
      withSpring(-5, { damping: 10, stiffness: 400 }),
      withSpring(0, { damping: 12, stiffness: 400 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: bounce.value }],
  }));

  const getSize = () => {
    switch (size) {
      case 'sm':
        return { width: 80, height: 90 };
      case 'lg':
        return { width: 120, height: 130 };
      default:
        return { width: 100, height: 110 };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 28;
      case 'lg':
        return 40;
      default:
        return 32;
    }
  };

  const renderIcon = () => {
    const iconSize = getIconSize();
    const iconColor = '#FFFFFF';

    switch (icon) {
      case 'glass':
        return <GlassIcon size={iconSize} color={iconColor} />;
      case 'bottle':
        return <BottleIcon size={iconSize} color={iconColor} />;
      case 'jug':
        return <JugIcon size={iconSize} color={iconColor} />;
      case 'custom':
        return <PlusIcon size={iconSize} color={iconColor} />;
      default:
        return <DropIcon size={iconSize} color={iconColor} />;
    }
  };

  const dimensions = getSize();

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        animatedStyle,
        styles.container,
        dimensions,
        {
          backgroundColor: theme.colors.primary,
          borderRadius: theme.layout.radiusLg,
        },
        theme.coloredShadows.primary(0.4),
      ]}
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <Typography variant="button" color="#FFFFFF">
        +{amount}
      </Typography>
      <Typography variant="caption" color="rgba(255,255,255,0.7)">
        ml
      </Typography>
    </AnimatedPressable>
  );
};

// Custom Add Button (for custom amounts)
interface CustomAddButtonProps {
  onPress: () => void;
}

export const CustomAddButton: React.FC<CustomAddButtonProps> = ({ onPress }) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        styles.customButton,
        {
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.layout.radiusMd,
        },
        theme.coloredShadows.secondary(0.3),
      ]}
    >
      <DropIcon size={24} color="#FFFFFF" />
      <Typography variant="button" color="#FFFFFF" style={styles.customText}>
        Custom
      </Typography>
    </AnimatedPressable>
  );
};

// Undo Button
interface UndoButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const UndoButton: React.FC<UndoButtonProps> = ({ onPress, disabled = false }) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (disabled) return;
    scale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 400 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        animatedStyle,
        styles.undoButton,
        {
          backgroundColor: disabled ? theme.colors.backgroundSecondary : `${theme.colors.danger}15`,
          borderRadius: theme.layout.radiusMd,
          borderWidth: 1,
          borderColor: disabled ? theme.colors.border : theme.colors.danger,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Typography
        variant="labelMedium"
        color={disabled ? theme.colors.textTertiary : theme.colors.danger}
      >
        Undo Last
      </Typography>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    marginBottom: 8,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  customText: {
    marginLeft: 8,
  },
  undoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default QuickAddButton;
