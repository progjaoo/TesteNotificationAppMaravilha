import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Platform } from 'react-native';

const API_URL = 'https://grupogtf.com.br/89fm/apisorteio';
const TOKEN_STORAGE_KEY = 'expo_push_token';

/**
 * Configuração de como as notificações devem aparecer
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Solicita permissão e obtém o token push
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  // Configuração de canais para Android
  if (Platform.OS === 'android') {
    // Canal padrão
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notificações Gerais',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF8000',
      sound: 'default',
    });

    // Canal específico para sorteios
    await Notifications.setNotificationChannelAsync('sorteios', {
      name: 'Novos Sorteios',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF8000',
      sound: 'default',
      description: 'Notificações de novos sorteios da Rádio 89 Maravilha',
    });
  }

  // Verifica se é dispositivo físico
  if (!Device.isDevice) {
    console.log('⚠️ Deve usar um dispositivo físico para notificações push');
    return null;
  }

  // Solicita permissão
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('❌ Permissão de notificação negada');
    return null;
  }

  try {
    // Obtém o projectId do app.json
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    
    if (!projectId) {
      console.error('❌ ProjectId não encontrado no app.json');
      console.error('Verifique se extra.eas.projectId está configurado');
      return null;
    }

    // Obtém o token Expo
    const tokenData = await Notifications.getExpoPushTokenAsync({ 
      projectId 
    });
    
    token = tokenData.data;
    console.log('✅ Token Expo obtido:', token);

  } catch (error) {
    console.error('❌ Erro ao obter token:', error);
    return null;
  }

  return token;
}

export async function registerDeviceToken(token: string): Promise<boolean> {
  try {
    // Verifica se o token já foi registrado anteriormente
    const savedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    
    if (savedToken === token) {
      console.log('ℹ️ Token já registrado no servidor (usando cache)');
      return true;
    }

    console.log(`📤 Registrando token no servidor para ${Platform.OS.toUpperCase()}`);

    // Envia para o backend
    const response = await fetch(`${API_URL}/push/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        plataforma: Platform.OS.toUpperCase(),
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Token registrado no servidor com sucesso');
      
      // Salva no cache local para evitar registros duplicados
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      
      return true;
    } else {
      console.error('❌ Erro ao registrar token:', data.erro);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro na requisição de registro:', error);
    return false;
  }
}

/**
 * Handler para quando a notificação é tocada
 */
function handleNotificationPress(data: any) {
  if (!data) {
    console.log('⚠️ Notificação sem dados');
    return;
  }

  console.log('📱 Dados da notificação:', data);

  // Navega baseado no tipo de notificação
  if (data.tipo === 'NOVO_SORTEIO' && data.sorteio_id) {
    console.log('🎯 Navegando para sorteio:', data.sorteio_id);
    
    // Pequeno delay para garantir que o app está pronto
    setTimeout(() => {
      router.replace('/47');
    }, 300);
  }
}

/**
 * Configuração dos listeners de notificação
 */
export function setupNotificationListeners() {
  // Listener para quando uma notificação é recebida (app em foreground)
  const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
    console.log('📨 Notificação recebida (app aberto):', notification);
    // A notificação já será exibida automaticamente pelo handler configurado
  });

  // Listener para quando a notificação é tocada
  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('👆 Notificação tocada:', response);
    const data = response.notification.request.content.data;
    handleNotificationPress(data);
  });

  // Retorna função para limpar os listeners (útil para cleanup)
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}

/**
 * Verifica se há uma notificação que abriu o app
 */
export async function checkInitialNotification() {
  const response = await Notifications.getLastNotificationResponseAsync();
  
  if (response) {
    console.log('🚀 App aberto por notificação:', response);
    const data = response.notification.request.content.data;
    
    // Pequeno delay para garantir que a navegação está pronta
    setTimeout(() => {
      handleNotificationPress(data);
    }, 1000);
  }
}

/**
 * Inicializa o serviço de notificações
 */
export async function initializeNotifications() {
  try {
    console.log('🔔 Inicializando serviço de notificações...');

    // Configura os listeners
    setupNotificationListeners();

    // Verifica se o app foi aberto por uma notificação
    await checkInitialNotification();

    // Obtém e registra o token
    const token = await registerForPushNotificationsAsync();

    if (token) {
      const registered = await registerDeviceToken(token);
      
      if (registered) {
        console.log('✅ Serviço de notificações inicializado com sucesso');
      } else {
        console.log('⚠️ Token obtido mas não foi possível registrar no servidor');
      }
    } else {
      console.log('⚠️ Não foi possível obter o token de notificação');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar notificações:', error);
  }
}

/**
 * Limpa o cache do token (útil para debug/logout)
 */
export async function clearTokenCache() {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    console.log('🗑️ Cache de token limpo');
  } catch (error) {
    console.error('❌ Erro ao limpar cache:', error);
  }
}