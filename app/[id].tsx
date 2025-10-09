import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

const Page = () => {
	const { id } = useLocalSearchParams();
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Stack.Screen options={{ title: `Page ${id}` }} />
			
		</View>
	);
};
export default Page;