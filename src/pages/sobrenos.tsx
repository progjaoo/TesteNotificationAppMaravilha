import { MaterialCommunityIcons } from '@expo/vector-icons'; // Para os ícones
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Definição de cores para fácil manutenção
const theme = {
  primary: '#FF8000',     
  secondary: '#0A2A4E',    
  text: '#444',           
  lightText: '#666',
  backgroundStart: '#FFFFFF',
  backgroundEnd: '#FFFFFF',
};

export default function SobreNos() {
  return (
    
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Seção do Header com a Logo */}
        <View style={styles.headerContainer}>
          
        </View>
        {/* Seção da Missão com Ícones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossa Missão</Text>
          <View style={styles.missionCard}>
            <MaterialCommunityIcons name="cross" size={24} color={theme.primary} style={styles.icon} />
            <Text style={styles.missionText}>Transmitir a <Text style={{fontWeight: 'bold'}}>Palavra de Deus</Text> com excelência.</Text>
          </View>
          <View style={styles.missionCard}>
            <MaterialCommunityIcons name="hand-heart" size={24} color={theme.primary} style={styles.icon} />
            <Text style={styles.missionText}>Compartilhar o <Text style={{fontWeight: 'bold'}}>Evangelho da Paz</Text> e da alegria.</Text>
          </View>
          <View style={styles.missionCard}>
            <MaterialCommunityIcons name="music-note" size={24} color={theme.primary} style={styles.icon} />
            <Text style={styles.missionText}>Abençoar e transformar vidas através da <Text style={{fontWeight: 'bold'}}>música</Text>.</Text>
          </View>
        </View>

        {/* Seção de Chamada para Ação */}
        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Sintonize</Text>
           <Text style={styles.callToActionText}>
             Em Belo Horizonte, conecte-se conosco em <Text style={styles.frequency}>89.1 FM</Text> e viva essa experiência! Cada canção e cada palavra são preparadas especialmente para você.
           </Text>
        </View>

      </ScrollView>
  );
}

// Folha de estilos completa
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: { 
    paddingVertical: 30,
    paddingHorizontal: 20, 
    flexGrow: 1 
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#eee', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.secondary,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: theme.lightText,
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 15,
    textAlign:'center'
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 15,
  },
  missionText: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
    flex: 1, 
  },
  callToActionText: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  frequency: {
    fontWeight: 'bold',
    color: theme.primary,
    fontSize: 18,
  },
});