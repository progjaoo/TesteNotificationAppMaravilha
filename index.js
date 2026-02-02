/**
 * index.js - Entry point do aplicativo
 * IMPORTANTE: Este arquivo deve estar na RAIZ do projeto (mesmo nível do package.json)
 * 
 * Configuração de background handlers para notificações FCM
 */

import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

/**
 * 🔔 Background Message Handler (FCM)
 * Este handler é chamado quando uma notificação chega enquanto o app está em background/quit
 * IMPORTANTE: Deve estar registrado ANTES do AppRegistry.registerComponent
 */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📨 Mensagem recebida em background:', remoteMessage);

  // Exibe a notificação usando Notifee
  if (remoteMessage.notification) {
    try {
      await notifee.displayNotification({
        title: remoteMessage.notification.title || '📢 Rádio 89 Maravilha',
        body: remoteMessage.notification.body || '',
        android: {
          channelId: remoteMessage.data?.tipo === 'NOVO_SORTEIO' ? 'sorteios' : 'default',
          smallIcon: 'ic_launcher', // ou 'ic_notification' se você criar um ícone customizado
          pressAction: {
            id: 'default',
          },
          sound: 'default',
          importance: 4, // HIGH
        },
        ios: {
          sound: 'default',
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
        },
        data: remoteMessage.data,
      });

      console.log('✅ Notificação exibida com sucesso');
    } catch (error) {
      console.error('❌ Erro ao exibir notificação:', error);
    }
  }
});

/**
 * 🔔 Background Event Handler (Notifee)
 * Este handler é chamado quando o usuário interage com a notificação em background
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('🔔 Evento Notifee em background:', type);

  if (type === EventType.PRESS && detail.notification) {
    console.log('👆 Notificação pressionada:', detail.notification);
    
    // Aqui você pode implementar navegação profunda (deep linking)
    const data = detail.notification.data;
    
    if (data?.tipo === 'NOVO_SORTEIO' && data?.sorteio_id) {
      console.log('🎯 Navegar para sorteio:', data.sorteio_id)
    }
  }
});

// Registra o componente principal do app
AppRegistry.registerComponent(appName, () => App);