import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';

export default function SocialLinks() {
  const openLink = async (url: string) => {
    if (await Linking.canOpenURL(url)) await Linking.openURL(url);
  };

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      bottom: 10,
      width: '100%',
      marginTop:40
    }}>
      <TouchableOpacity onPress={() => openLink('https://api.whatsapp.com/send?phone=5531999982089')}>
        <Ionicons name="logo-whatsapp" size={32} color="#FF8000" style={{ marginHorizontal: 20, marginBottom:30 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLink('https://www.instagram.com/radio89maravilha/')}>
        <Ionicons name="logo-instagram" size={32} color="#FF8000" style={{ marginHorizontal: 20,  marginBottom:30 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLink('https://www.youtube.com/@radio89maravilha')}>
        <Ionicons name="logo-youtube" size={32} color="#FF8000" style={{ marginHorizontal: 20,  marginBottom:30}} />
      </TouchableOpacity>
    </View>
  );
}
