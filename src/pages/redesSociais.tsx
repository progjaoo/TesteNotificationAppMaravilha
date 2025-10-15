import React from 'react';
import { Image, Linking, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/redesSociais.styles';

export default function RedesSociais() {
  return (
    <View style={styles.container}>

      <View style={styles.cardsContainer}>
        {/* WhatsApp */}
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://api.whatsapp.com/send?phone=5531999982089')
          }
        >
          <Image
            source={require('../../assets/rede-social-wpp.png')}
            style={styles.socialImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Instagram */}
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.instagram.com/radio89maravilha/')
          }
        >
          <Image
            source={require('../../assets/rede-social-insta.png')}
            style={styles.socialImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* YouTube */}
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.youtube.com/@radio89maravilha')
          }
        >
          <Image
            source={require('../../assets/rede-social-youtube.png')}
            style={styles.socialImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
