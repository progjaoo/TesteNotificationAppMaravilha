import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
/**
 * Permite exibir notificações mesmo com o app aberto (foreground)
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // Desabilitamos o alerta do Expo no foreground pois usaremos o Notifee para isso
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
/**
 * Registra o app para receber push e retorna o Expo Push Token
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('❌ Push só funciona em dispositivo físico');
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('❌ Permissão de notificação negada');
    return null;
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })
  ).data;

  console.log('✅ Expo Push Token:', token);

  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  return token;
}

/**
 * Listener para notificações recebidas com o app aberto
 */
export function useNotificationListener() {
  const router = useRouter();

  useEffect(() => {
    // Listener do Expo para receber a notificação
    const subscription =
      Notifications.addNotificationReceivedListener(async (notification) => {
        console.log('📩 Notificação recebida via Expo:', notification);

        const { title, body, data } = notification.request.content;

        // Exibir notificação local com Notifee para maior customização no foreground
        await notifee.displayNotification({
          title: title ?? '📢 Rádio 89 Maravilha',
          body: body ?? 'Novo sorteio disponível!',
          data: data as any,
          android: {
            channelId: 'default',
            pressAction: {
              id: 'default',
            },
            data: data as any,
          },
        });
      });

    // Listener do Notifee para cliques em notificações no foreground
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const sorteio_id = detail.notification?.data?.sorteio_id;
        if (sorteio_id) {
          router.push(`/detalhesSorteio?id=${sorteio_id}`);
        }
      }
    });

    return () => {
      subscription.remove();
      unsubscribeNotifee();
    };
  }, [router]);
}

export function useNotificationNavigation() {
  const router = useRouter();

  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;

        if (data?.tipo === 'NOVO_SORTEIO' && data.sorteio_id) {
          router.push(`/detalhesSorteio?id=${data.sorteio_id}`);
        }
      });

    return () => subscription.remove();
  }, [router]);
}