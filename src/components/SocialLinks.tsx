import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SocialLinks() {
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Não foi possível abrir o link: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=5531999982089')}>
        <Image
          source={require('../../assets/whatsapp.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/radio89maravilha/')}>
        <Image
          source={require('../../assets/instagram.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/@radio89maravilha')}>
        <Ionicons
          name="logo-youtube"
          size={32}
          color="#FF8000"
          style={styles.iconVector}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
    position: 'relative', 
    bottom: 10,
  },
  iconImage: {
    width: 29,
    height: 29,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  iconVector: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
});