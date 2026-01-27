import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, usePathname } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/index.styles';

export default function AppHeader() {
  const navigation = useNavigation();
  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <View style={styles.customHeader}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="menu" size={30} color="#fff" />
      </TouchableOpacity>

      <Image
        source={require('../../assets/maravilhabranco.png')}
        style={styles.logoHeader}
      />

      {isHome ? (
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={26} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 26 }} />
      )}
    </View>
  );
}
