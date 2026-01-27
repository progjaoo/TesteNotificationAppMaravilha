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
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
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
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF8000',
    });
  }

  return token;
}

/**
 * Listener para notificações recebidas com o app aberto
 */
export function useNotificationListener() {
  useEffect(() => {
    const subscription =
      Notifications.addNotificationReceivedListener(notification => {
        console.log('📩 Notificação recebida:', notification);
      });

    return () => subscription.remove();
  }, []);
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