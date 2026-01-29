import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import api from './api';
import { registerForPushNotificationsAsync } from './notifications';

export async function initPush() {

  try {
    const token = await registerForPushNotificationsAsync();
    if (!token) return;

    const savedToken = await AsyncStorage.getItem('push_token');
    if (savedToken === token) {
      console.log('ℹ️ Token já registrado no servidor.');
      return;
    }

    console.log(`Tentando registrar token no servidor para plataforma: ${Platform.OS.toUpperCase()}`);
    
    await api.post('/push/register.php', {
      token,
      plataforma: Platform.OS.toUpperCase(),
    });

    await AsyncStorage.setItem('push_token', token);
    console.log('✅ Token registrado com sucesso no servidor.');
  } catch (error) {
    console.error('❌ Erro ao inicializar push:', error);
  }
}