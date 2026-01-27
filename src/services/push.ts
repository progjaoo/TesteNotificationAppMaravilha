import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import api from './api';
import { registerForPushNotificationsAsync } from './notifications';

export async function initPush() {
  const saved = await AsyncStorage.getItem('push_registered');
  if (saved === '1') return;

  const token = await registerForPushNotificationsAsync();
  if (!token) return;

  await api.post('/push/register.php', {
    token,
    plataforma: Platform.OS.toUpperCase(),
  });

  await AsyncStorage.setItem('push_registered', '1');
}
