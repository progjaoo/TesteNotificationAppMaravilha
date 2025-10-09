import Ionicons from '@expo/vector-icons/Ionicons';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList
} from '@react-navigation/drawer';
import { usePathname, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Image, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function CustomDrawerContent(props: DrawerContentComponentProps) {
	const menuItems = [
		{ id: 42, title: 'Promoções' },
		{ id: 43, title: 'Programação' },
		{ id: 44, title: 'Informações' }
	];
	const router = useRouter();
	const pathname = usePathname();

	return (
		<DrawerContentScrollView {...props}>
			<View style={{ padding: 16, alignItems: 'center' }}>
				<Image
					source={require('@/assets/images/logomaravilha.png')}
					style={{ width: 100, height: 100, borderRadius: 0 }}
				/>
			</View>
			<DrawerItemList {...props} />

			<View style={{ padding: 16, paddingTop: 40 }}>
				<Text style={{ fontSize: 16, fontWeight: 'bold' }}>Opções</Text>
			</View>

			{menuItems.map((item) => {
				const isActive = pathname === `/${item.id}`;

				return (
					<DrawerItem
						activeTintColor="red"
						focused={isActive}
						key={item.id}
						label={item.title}
						onPress={() => router.push(`/${item.id}`)}
					/>
				);
			})}
		</DrawerContentScrollView>
	);
}

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer
				drawerContent={CustomDrawerContent}
				screenOptions={{
					drawerActiveTintColor: 'red',
					drawerHideStatusBarOnOpen: true
				}}
			>
				<Drawer.Screen
				name="index"
				options={{
					drawerLabel: 'Rádio Maravilha - 89.1',
					title: 'Rádio Maravilha - 89.1',
					drawerIcon: ({ color, size }) => (
					<Ionicons name="radio" size={size} color={color} />
					),
				}}
				/>

				<Drawer.Screen
					name="[id]"
					options={{
						drawerItemStyle: {
							display: 'none'
						}
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	);
}