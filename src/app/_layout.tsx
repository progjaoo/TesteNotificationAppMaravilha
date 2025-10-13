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
		// { id: 42, title: 'Notícias', icon: 'book-outline' },
		// { id: 43, title: 'Programação', icon: 'calendar-outline' },
		{ id: 44, title: 'Informações', icon: 'information-circle-outline' },
		{ id: 45, title: 'Redes Sociais', icon: 'globe' }
	];
	const router = useRouter();
	const pathname = usePathname();

	return (
		<DrawerContentScrollView {...props}>
			<View style={{ padding: 16, alignItems: 'center' }}>
				<Image
					source={require('@/assets/images/logomaravilha.png')}
					style={{ width: 150, height: 100 }}
				/>
			</View>

			<DrawerItemList {...props} />

			<View style={{ padding: 16, paddingTop: 40 }}>
				<Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Opções</Text>
			</View>

			{menuItems.map((item) => {
				const isActive = pathname === `/${item.id}`;

				return (
					<DrawerItem
						key={item.id}
						label={item.title}
						onPress={() => router.push(`/${item.id}`)}
						focused={isActive}
						activeTintColor="#fff"
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
						icon={({ size, color }) => (
							<Ionicons
								name={item.icon as any}
								size={size + 2}
								color={isActive ? '#fff' : '#f5f5f5'}
								style={{ marginRight: -4 }}
							/>
						)}
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
					drawerHideStatusBarOnOpen: true,
					drawerStyle: { backgroundColor: '#FF8000' }
				}}
			>
				<Drawer.Screen
					name="index"
					options={{
						drawerLabel: 'Rádio Maravilha - 89.1',
						drawerLabelStyle: {
							fontWeight: 'bold',
							fontSize: 17,
						},
						title: 'Rádio Maravilha - 89.1',
						drawerActiveTintColor: 'white',
						drawerIcon: ({ color, size }) => (
							<Ionicons name="radio" size={size + 4} color={color} />
						),
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
