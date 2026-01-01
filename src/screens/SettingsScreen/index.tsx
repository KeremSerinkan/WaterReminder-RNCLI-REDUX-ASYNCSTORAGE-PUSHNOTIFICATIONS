import React, { useState } from 'react';
import { View, Switch, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import { useTheme } from '../../theme';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  selectSettings,
  setThemeMode,
  setNotificationsEnabled,
  setIntervalMinutes,
} from '../../store/slices/settingsSlice';

import { Typography } from '../../components/Typography';
import { SectionCard, ListItem } from '../../components/Card';
import { Modal } from '../../components/Modal';

import { INTERVAL_OPTIONS, ThemeMode } from '../../types';

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const [showIntervalPicker, setShowIntervalPicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [tempInterval, setTempInterval] = useState(settings.intervalMinutes);
  const [tempTheme, setTempTheme] = useState(settings.themeMode);

  const handleToggleNotifications = (value: boolean) => {
    dispatch(setNotificationsEnabled(value));
  };

  const handleSaveInterval = () => {
    dispatch(setIntervalMinutes(tempInterval));
    setShowIntervalPicker(false);
  };

  const handleSaveTheme = () => {
    dispatch(setThemeMode(tempTheme));
    setShowThemePicker(false);
  };

  const getIntervalLabel = (minutes: number): string => {
    const option = INTERVAL_OPTIONS.find((opt) => opt.value === minutes);
    return option?.label || `${minutes} minutes`;
  };

  const getThemeLabel = (mode: ThemeMode): string => {
    const option = THEME_OPTIONS.find((opt) => opt.value === mode);
    return option?.label || mode;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="displaySmall" color={theme.colors.text}>
            Settings
          </Typography>
        </View>

        {/* Notifications Section */}
        <Typography
          variant="labelMedium"
          color={theme.colors.textSecondary}
          style={styles.sectionTitle}
        >
          NOTIFICATIONS
        </Typography>
        <SectionCard style={styles.sectionCard}>
          <ListItem
            label="Reminders"
            rightElement={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{
                  false: theme.colors.border,
                  true: `${theme.colors.primary}80`,
                }}
                thumbColor={
                  settings.notificationsEnabled
                    ? theme.colors.primary
                    : theme.colors.textTertiary
                }
              />
            }
          />
          {settings.notificationsEnabled && (
            <ListItem
              label="Reminder Interval"
              value={getIntervalLabel(settings.intervalMinutes)}
              onPress={() => {
                setTempInterval(settings.intervalMinutes);
                setShowIntervalPicker(true);
              }}
              showChevron
            />
          )}
        </SectionCard>

        {/* Appearance Section */}
        <Typography
          variant="labelMedium"
          color={theme.colors.textSecondary}
          style={styles.sectionTitle}
        >
          APPEARANCE
        </Typography>
        <SectionCard style={styles.sectionCard}>
          <ListItem
            label="Theme"
            value={getThemeLabel(settings.themeMode)}
            onPress={() => {
              setTempTheme(settings.themeMode);
              setShowThemePicker(true);
            }}
            showChevron
          />
        </SectionCard>

        {/* About Section */}
        <Typography
          variant="labelMedium"
          color={theme.colors.textSecondary}
          style={styles.sectionTitle}
        >
          ABOUT
        </Typography>
        <SectionCard style={styles.sectionCard}>
          <ListItem label="Version" value="2.0.0" />
          <ListItem label="Build" value="1" />
        </SectionCard>

        {/* Footer */}
        <View style={styles.footer}>
          <Typography variant="caption" color={theme.colors.textTertiary} align="center">
            Water Reminder
          </Typography>
          <Typography variant="caption" color={theme.colors.textTertiary} align="center">
            Stay hydrated, stay healthy 💧
          </Typography>
        </View>
      </ScrollView>

      {/* Interval Picker Modal */}
      <Modal
        visible={showIntervalPicker}
        onClose={() => setShowIntervalPicker(false)}
        title="Reminder Interval"
      >
        <Picker
          selectedValue={tempInterval}
          onValueChange={(value) => setTempInterval(value)}
          style={{ color: theme.colors.text }}
        >
          {INTERVAL_OPTIONS.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={theme.colors.text}
            />
          ))}
        </Picker>
        <View style={styles.modalActions}>
          <View style={styles.modalButton}>
            <Typography
              variant="button"
              color={theme.colors.textSecondary}
              onPress={() => setShowIntervalPicker(false)}
            >
              Cancel
            </Typography>
          </View>
          <View style={styles.modalButton}>
            <Typography
              variant="button"
              color={theme.colors.primary}
              onPress={handleSaveInterval}
            >
              Save
            </Typography>
          </View>
        </View>
      </Modal>

      {/* Theme Picker Modal */}
      <Modal
        visible={showThemePicker}
        onClose={() => setShowThemePicker(false)}
        title="Theme"
      >
        <Picker
          selectedValue={tempTheme}
          onValueChange={(value) => setTempTheme(value)}
          style={{ color: theme.colors.text }}
        >
          {THEME_OPTIONS.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={theme.colors.text}
            />
          ))}
        </Picker>
        <View style={styles.modalActions}>
          <View style={styles.modalButton}>
            <Typography
              variant="button"
              color={theme.colors.textSecondary}
              onPress={() => setShowThemePicker(false)}
            >
              Cancel
            </Typography>
          </View>
          <View style={styles.modalButton}>
            <Typography
              variant="button"
              color={theme.colors.primary}
              onPress={handleSaveTheme}
            >
              Save
            </Typography>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    marginBottom: 24,
  },
  footer: {
    marginTop: 32,
    marginBottom: 20,
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 24,
  },
  modalButton: {
    padding: 8,
  },
});

export default SettingsScreen;
