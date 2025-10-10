import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { JSX } from 'react/jsx-runtime';
import Informacoes from '../pages/informacoes';
import Noticias from '../pages/noticiais';
import Programacao from '../pages/programacao';

export default function Page() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const pages: Record<string, { title: string; component: JSX.Element }> = {
    '42': { title: 'Notícias', component: <Noticias /> },
    '43': { title: 'Programação', component: <Programacao /> },
    '44': { title: 'Informações', component: <Informacoes /> },
  };

  const current = pages[id as string] || { title: 'Página', component: <View /> };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: current.title,
          headerStyle: { backgroundColor: '#FF8000' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 16 }}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      {current.component}
    </View>
  );
}
