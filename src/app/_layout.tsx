// app/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import { usePathname, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppHeader from '../components/AppHeader';
import { useNotificationListener, useNotificationNavigation } from '../services/notifications';
import { initPush } from '../services/push';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useNotificationListener();
  useNotificationNavigation();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      initPush();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="index"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: 'red',
          drawerHideStatusBarOnOpen: true,
          drawerStyle: { backgroundColor: '#FF8000' },
          header: () => <AppHeader />,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Rádio Maravilha - 89.1',
            drawerLabelStyle: { fontWeight: 'bold', fontSize: 17 },
            title: 'Rádio Maravilha - 89.1',
            drawerActiveTintColor: 'white',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="radio" size={size + 4} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="cadastroParticipante"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'Cadastro para Sorteio',
          }}
        />

        <Drawer.Screen
          name="detalhesSorteio"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />

        <Drawer.Screen
          name="[id]"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

/* 🔥 DRAWER CUSTOMIZADO */
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 45, title: 'Redes Sociais', icon: 'globe' },
    { id: 46, title: 'Sobre Nós', icon: 'information-circle-outline' },
    { id: 47, title: 'Sorteios', icon: 'calendar' },
    { id: 48, title: 'Consultar Sorteios', icon: 'search' }
  ];

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Image
          source={require('@/assets/logomaravilha.png')}
          style={{ width: 150, height: 100 }}
        />
      </View>

      <DrawerItemList {...props} />

      <View style={{ padding: 16, paddingTop: 40 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
          Opções
        </Text>
      </View>

      {menuItems.map((item) => {
        const isActive = pathname === `/${item.id}`;

        return (
          <DrawerItem
            key={item.id}
            label={item.title}
            onPress={() => router.push(`/${item.id}`)}
            focused={isActive}
            style={{
              marginHorizontal: 8,
              borderRadius: 8,
              backgroundColor: isActive ? '#e76f00' : 'transparent',
            }}
            labelStyle={{
              fontSize: 16,
              fontWeight: 'bold',
              color: isActive ? '#fff' : '#f5f5f5',
              marginLeft: 4,
            }}
            icon={({ size }) => (
              <Ionicons
                name={item.icon as any}
                size={size + 2}
                color={isActive ? '#fff' : '#f5f5f5'}
              />
            )}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}
