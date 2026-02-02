// index.js
import notifee, { EventType } from '@notifee/react-native';

/**
 * Registro de eventos em background do Notifee.
 * Deve ser chamado antes de inicializar o app para garantir que o Android capture eventos.
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  console.log('Background event received:', type);

  if (type === EventType.PRESS) {
    console.log('User pressed notification in background', notification);
  }
});

// Inicializa o Expo Router
import 'expo-router/entry';
