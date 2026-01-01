import { useEffect, useCallback } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { useAppSelector } from '../../store';
import { selectSettings } from '../../store/slices/settingsSlice';

export const useNotifications = () => {
  const settings = useAppSelector(selectSettings);

  // Request notification permissions
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      } else {
        const authStatus = await messaging().requestPermission();
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }, []);

  // Get FCM token
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }, []);

  // Save device settings to Firestore
  const saveDeviceSettings = useCallback(
    async (token: string) => {
      try {
        await firestore()
          .collection('Devices')
          .doc(token)
          .set(
            {
              fcmToken: token,
              enabled: settings.notificationsEnabled,
              interval: settings.intervalMinutes,
              updatedAt: Date.now(),
            },
            { merge: true }
          );
      } catch (error) {
        console.error('Failed to save device settings:', error);
      }
    },
    [settings.notificationsEnabled, settings.intervalMinutes]
  );

  // Initialize notifications
  const initialize = useCallback(async () => {
    const hasPermission = await requestPermission();

    if (!hasPermission) {
      Alert.alert(
        'Notifications Disabled',
        'Enable notifications in settings to receive water reminders.',
        [{ text: 'OK' }]
      );
      return;
    }

    const token = await getToken();
    if (token) {
      await saveDeviceSettings(token);
    }
  }, [requestPermission, getToken, saveDeviceSettings]);

  // Listen for token refresh
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
      await saveDeviceSettings(newToken);
    });

    return unsubscribe;
  }, [saveDeviceSettings]);

  // Sync settings changes to Firestore
  useEffect(() => {
    const syncSettings = async () => {
      const token = await getToken();
      if (token) {
        await saveDeviceSettings(token);
      }
    };

    syncSettings();
  }, [settings.notificationsEnabled, settings.intervalMinutes, getToken, saveDeviceSettings]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    initialize,
    requestPermission,
    getToken,
  };
};

export default useNotifications;
