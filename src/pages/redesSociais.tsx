import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/redesSociais.styles';

export default function RedesSociais() {
  return (
    
      <View style={styles.overlay}>
        <Text style={styles.title}>Siga nossas Redes Sociais</Text>
        <Text style={styles.subtitle}>Fique por dentro de notícias, eventos e conteúdos.</Text>

        <View style={styles.cardsContainer}>
          {/* WhatsApp */}
          <TouchableOpacity
            style={[styles.card, styles.whatsapp]}
            onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=5531999982089')}
          >
            <Ionicons name="logo-whatsapp" size={36} color="#fff" />
            <Text style={styles.cardText}>Fale Conosco</Text>
            <Text style={styles.cardSubtext}>(31) 99998-2089</Text>
          </TouchableOpacity>

          {/* Instagram */}
          <TouchableOpacity
            style={[styles.card, styles.instagram]}
            onPress={() => Linking.openURL('https://www.instagram.com/radio89maravilha/')}
          >
            <Ionicons name="logo-instagram" size={36} color="#fff" />
            <Text style={styles.cardText}>@radio89maravilha</Text>
          </TouchableOpacity>

          {/* YouTube */}
          <TouchableOpacity
            style={[styles.card, styles.youtube]}
            onPress={() => Linking.openURL('https://www.youtube.com/@radio89maravilha')}
          >
            <Ionicons name="logo-youtube" size={36} color="#fff" />
            <Text style={styles.cardText}>Nosso Canal</Text>
            <Text style={styles.cardSubtext}>@radio89maravilha</Text>
          </TouchableOpacity>
        </View>
      </View>

  );
}
