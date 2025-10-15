import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Informacoes from '../pages/informacoes';
import RedesSociais from '../pages/redesSociais';
import SobreNos from '../pages/sobrenos';

export default function Page() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const pages: Record<string, { title: string; component: React.ReactNode }> = {
    '44': { title: 'Informações', component: <Informacoes /> },
    '45': { title: 'Redes Sociais', component: <RedesSociais /> },
    '46': { title: 'Sobre Nós', component: <SobreNos /> },
  };

  const current = pages[id as string] || { title: 'Página', component: <View /> };

  const handleGoBack = () => {
    router.replace('/'); 
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => (
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={handleGoBack}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>{current.title}</Text>
              <View style={styles.rightPlaceholder} />
            </View>
          ),
        }}
      />
      {current.component}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FF8000',
    height: Platform.OS === 'ios' ? 115 : 115,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: Platform.OS === 'ios' ? 65 : 60,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    top: Platform.OS === 'ios' ? 2 : 5,
  },
  rightPlaceholder: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 48 : 34,
    width: 28,
    height: 28,
  },
});
