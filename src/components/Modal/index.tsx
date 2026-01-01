import React, { useEffect } from 'react';
import {
  Modal as RNModal,
  View,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TextInput,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { Typography } from '../Typography';
import { Button } from '../Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  const theme = useTheme();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 300 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.overlay,
            { backgroundColor: theme.colors.overlay },
            overlayStyle,
          ]}
        >
          <Pressable style={styles.overlayPress} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.layout.radiusXl,
              borderTopRightRadius: theme.layout.radiusXl,
            },
            contentStyle,
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleContainer}>
            <View
              style={[styles.handle, { backgroundColor: theme.colors.border }]}
            />
          </View>

          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && (
                <Typography variant="h2" style={styles.title}>
                  {title}
                </Typography>
              )}
              {showCloseButton && (
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <Typography variant="h2" color={theme.colors.textTertiary}>
                    ×
                  </Typography>
                </Pressable>
              )}
            </View>
          )}

          {/* Content */}
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

// Confirmation modal with actions
interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} onClose={onClose} title={title} showCloseButton={false}>
      <Typography
        variant="bodyMedium"
        color={theme.colors.textSecondary}
        style={styles.message}
      >
        {message}
      </Typography>
      <View style={styles.actions}>
        <Button
          title={cancelText}
          variant="outline"
          onPress={onClose}
          style={styles.actionButton}
        />
        <Button
          title={confirmText}
          variant={confirmVariant}
          onPress={() => {
            onConfirm();
            onClose();
          }}
          style={styles.actionButton}
        />
      </View>
    </Modal>
  );
};

// Input modal for custom values
interface InputModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  submitText?: string;
  initialValue?: string;
}

export const InputModal: React.FC<InputModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  placeholder,
  keyboardType = 'default',
  submitText = 'Add',
  initialValue = '',
}) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    if (visible) {
      setValue(initialValue);
    }
  }, [visible, initialValue]);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title={title}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
          theme.textStyles.bodyLarge,
        ]}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        keyboardType={keyboardType}
        autoFocus
        onSubmitEditing={handleSubmit}
      />
      <View style={styles.actions}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={onClose}
          style={styles.actionButton}
        />
        <Button
          title={submitText}
          variant="primary"
          onPress={handleSubmit}
          style={styles.actionButton}
          disabled={!value.trim()}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayPress: {
    flex: 1,
  },
  content: {
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingBottom: 34, // Safe area bottom
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  message: {
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
});

export default Modal;
