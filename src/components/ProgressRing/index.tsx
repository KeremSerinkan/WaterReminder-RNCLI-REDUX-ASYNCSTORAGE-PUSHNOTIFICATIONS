import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { Typography, NumericText } from '../Typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0-100
  current: number; // Current water amount in ml
  goal: number; // Goal in ml
  size?: number;
  strokeWidth?: number;
  onPress?: () => void;
  showUndoFeedback?: number | null; // Amount that was undone
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  current,
  goal,
  size = 200,
  strokeWidth = 14,
  onPress,
  showUndoFeedback,
}) => {
  const theme = useTheme();
  const animatedProgress = useSharedValue(0);
  const scale = useSharedValue(1);
  const undoOpacity = useSharedValue(0);
  const undoTranslateY = useSharedValue(0);

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animate progress changes
  useEffect(() => {
    animatedProgress.value = withSpring(Math.min(progress, 100), {
      damping: 20,
      stiffness: 90,
      overshootClamping: false,
    });
  }, [progress]);

  // Undo feedback animation
  useEffect(() => {
    if (showUndoFeedback !== null && showUndoFeedback !== undefined) {
      undoOpacity.value = 1;
      undoTranslateY.value = 0;
      undoOpacity.value = withTiming(0, { duration: 1200 });
      undoTranslateY.value = withTiming(-40, { duration: 1200 });
    }
  }, [showUndoFeedback]);

  // Get color based on progress
  const getProgressColor = (p: number): string => {
    if (p >= 100) return theme.colors.success;
    if (p >= 70) return theme.colors.water;
    if (p >= 40) return theme.colors.warning;
    return theme.colors.danger;
  };

  // Animated stroke dashoffset
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset =
      circumference - (animatedProgress.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  // Press animation
  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const undoFeedbackStyle = useAnimatedStyle(() => ({
    opacity: undoOpacity.value,
    transform: [{ translateY: undoTranslateY.value }],
  }));

  const progressColor = getProgressColor(progress);

  const content = (
    <Animated.View style={[styles.container, { width: size, height: size }, containerStyle]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={progressColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={progressColor} stopOpacity="0.7" />
          </LinearGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.backgroundSecondary}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* Undo feedback */}
        {showUndoFeedback !== null && showUndoFeedback !== undefined && (
          <Animated.View style={[styles.undoFeedback, undoFeedbackStyle]}>
            <Typography variant="labelLarge" color={theme.colors.danger}>
              -{showUndoFeedback}ml
            </Typography>
          </Animated.View>
        )}

        {/* Current amount */}
        <NumericText size="lg" color={progressColor}>
          {current}
        </NumericText>

        {/* Goal */}
        <Typography variant="labelMedium" color={theme.colors.textSecondary}>
          / {goal} ml
        </Typography>

        {/* Percentage */}
        <View style={[styles.percentageBadge, { backgroundColor: `${progressColor}20` }]}>
          <Typography variant="labelSmall" color={progressColor}>
            {Math.round(progress)}%
          </Typography>
        </View>
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {content}
      </Pressable>
    );
  }

  return content;
};

// Small progress indicator for history cards
interface MiniProgressProps {
  progress: number;
  size?: number;
}

export const MiniProgress: React.FC<MiniProgressProps> = ({
  progress,
  size = 40,
}) => {
  const theme = useTheme();
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  const getColor = () => {
    if (progress >= 100) return theme.colors.success;
    if (progress >= 70) return theme.colors.water;
    return theme.colors.danger;
  };

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={theme.colors.backgroundSecondary}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={getColor()}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${center}, ${center}`}
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  undoFeedback: {
    position: 'absolute',
    top: -30,
  },
  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
});

export default ProgressRing;
