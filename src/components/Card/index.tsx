import React from 'react';
import { View, Pressable, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  padding = 'md',
  style,
  animated = true,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress && animated) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress && animated) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  // Get padding based on size
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.xl;
      default:
        return theme.spacing.lg;
    }
  };

  // Get variant styles
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surfaceElevated,
          ...theme.shadows.lg,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.sm,
        };
    }
  };

  const cardStyles: ViewStyle = {
    borderRadius: theme.layout.radiusLg,
    padding: getPadding(),
    ...getVariantStyles(),
  };

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, cardStyles, style]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={[cardStyles, style]}>{children}</View>;
};

// Section Card for settings and grouped content
interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }, style]}>
      {title && (
        <View style={[styles.sectionHeader, { borderBottomColor: theme.colors.divider }]}>
          <Animated.Text style={[theme.textStyles.labelMedium, { color: theme.colors.textSecondary }]}>
            {title.toUpperCase()}
          </Animated.Text>
        </View>
      )}
      {children}
    </View>
  );
};

// List item for use within cards
interface ListItemProps {
  label: string;
  value?: string | React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
  label,
  value,
  onPress,
  showChevron = false,
  leftIcon,
  rightElement,
}) => {
  const theme = useTheme();

  const content = (
    <View style={[styles.listItem, { borderBottomColor: theme.colors.divider }]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <View style={styles.listItemContent}>
        <Animated.Text style={[theme.textStyles.bodyMedium, { color: theme.colors.text }]}>
          {label}
        </Animated.Text>
      </View>
      {typeof value === 'string' ? (
        <Animated.Text style={[theme.textStyles.bodyMedium, { color: theme.colors.textSecondary }]}>
          {value}
        </Animated.Text>
      ) : (
        value
      )}
      {rightElement}
      {showChevron && (
        <Animated.Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>
          ›
        </Animated.Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listItemContent: {
    flex: 1,
  },
  leftIcon: {
    marginRight: 12,
  },
  chevron: {
    fontSize: 20,
    marginLeft: 8,
  },
});

export default Card;
