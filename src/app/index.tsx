import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Stack, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getRadioInfo } from '../api/radioService';
import SocialLinks from '../components/SocialLinks';

const { height } = Dimensions.get('window');

export default function Index() {
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(height * 0.8)).current;
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'ouvir' | 'assistir'>('ouvir');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const [musicaAtual, setMusicaAtual] = useState('-');
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');

  const borderRadius = translateY.interpolate({
    inputRange: [getSheetPositionExpanded(), getSheetPositionCollapsed()],
    outputRange: [0, 24],
    extrapolate: 'clamp',
  });

  function getSheetPositionCollapsed() {
    return Platform.select({
      ios: height * 0.75,
      android: height * 0.8,
      default: height * 0.8,
    })!;
  }

  function getSheetPositionExpanded() {
    return 0;
  }

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.log('Erro ao configurar áudio:', e);
      }
    })();

    // 🔄 Carrega as informações da rádio
    const fetchRadioInfo = async () => {
      const info = await getRadioInfo();
      if (info) {
        setMusicaAtual(info.musica_atual || '-');
        setTitulo(info.titulo || '');
        setGenero(info.genero || '');
      }
    };

    fetchRadioInfo();
    const interval = setInterval(fetchRadioInfo, 20000); // atualiza a cada 20s
    return () => clearInterval(interval);
  }, []);

  const togglePlay = async () => {
    try {
      if (!soundRef.current) {
        setLoading(true);
        const { sound } = await Audio.Sound.createAsync(
          {
            uri: 'https://stm19.srvstm.com:7080/stream',
          },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setIsPlaying(true);
      } else {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error('Erro ao reproduzir:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSheet = () => {
    Animated.timing(translateY, {
      toValue: expanded ? getSheetPositionCollapsed() : getSheetPositionExpanded(),
      duration: 350,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: getSheetPositionCollapsed(),
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          '🎶 Ouça agora a Rádio Maravilha - 89.1 FM! Baixe o app ou ouça online: https://radio-maravilha.com',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const playerHTML = `
    <html>
      <body style="margin:0;padding:0;overflow:hidden;background:black;">
        <iframe
          src="https://playerv.srvstm.com/video/radioenergia7960//true/false/V1hwT1UyUkhVbkZTV0ZacVRUQnZlVmw2VGxOa1JYaDBWRzVhYVZWVU1Eaz0rUg==/16:9/nao/nao/nao"
          style="width:100%;height:100%;border:none;"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <View style={styles.customHeader}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <Ionicons name="menu" size={30} color="#fff" />
              </TouchableOpacity>

              <Image
                source={require('../../assets/images/maravilhabranco.png')}
                style={styles.logoHeader}
              />

              <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                <Ionicons name="share-social-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <View style={styles.mainContent}>
        <Ionicons name="radio" size={90} color="#FF8000" />
        <SocialLinks />
      </View>

      {/* BOTTOM SHEET */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }],
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          },
        ]}
      >
        <TouchableOpacity onPress={toggleSheet} activeOpacity={0.9} style={styles.sheetHeader}>
          {/* LADO ESQUERDO */}
          <View style={styles.headerLeft}>
            {!expanded && (
              <>
                <TouchableOpacity onPress={togglePlay} style={styles.miniPlayButton}>
                  {loading ? (
                    <ActivityIndicator color="#FF8000" />
                  ) : (
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#FF8000" />
                  )}
                </TouchableOpacity>
                <Text style={styles.sheetTitleMinimized}>Ouça Ao Vivo</Text>
              </>
            )}
          </View>

          {/* SETA DIREITA */}
          <View
            style={[
              styles.arrowWrapper,
              expanded ? styles.arrowWrapperExpanded : styles.arrowWrapperCollapsed,
            ]}
          >
            <Ionicons name={expanded ? 'chevron-down' : 'chevron-up'} size={28} color="#fff" />
          </View>
        </TouchableOpacity>

        {expanded && (
          <>
            {/* TABS */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'ouvir' && styles.tabActive,
                  activeTab === 'ouvir' && { marginBottom: 5 },
                ]}
                onPress={() => setActiveTab('ouvir')}
              >
                <Text style={[styles.tabText, activeTab === 'ouvir' && styles.tabTextActive]}>
                  Ouvir
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'assistir' && styles.tabActive,
                  activeTab === 'assistir' && { marginBottom: 5 },
                ]}
                onPress={() => setActiveTab('assistir')}
              >
                <Text style={[styles.tabText, activeTab === 'assistir' && styles.tabTextActive]}>
                  Assistir
                </Text>
              </TouchableOpacity>
            </View>

            {/* CONTEÚDO */}
            <View style={styles.contentArea}>
              {activeTab === 'ouvir' ? (
                <View style={styles.audioContainer}>
                  <Image
                    source={require('../../assets/images/musica.png')}
                    style={styles.musicImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.musicTitle}>Nome da Música: {musicaAtual}</Text>
                  <Text style={styles.musicSubtitle}>
                    A Rádio de Todas as Igrejas{'\n'}     que toca o som do céu
                  </Text>
                  <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
                    {loading ? (
                      <ActivityIndicator color="#FF8000" />
                    ) : (
                      <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={36}
                        color="#FF8000"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.webviewContainer}>
                  <WebView source={{ html: playerHTML }} allowsFullscreenVideo />
                </View>
              )}
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  customHeader: {
    backgroundColor: '#FF8000',
    height: 115,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    position: 'relative',
  },
  menuButton: { position: 'absolute', left: 20, top: 55 },
  shareButton: { position: 'absolute', right: 20, top: 55 },
  logoHeader: { width: 160, height: 150, resizeMode: 'contain', marginBottom: 10 },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height,
    backgroundColor: '#FF8000',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetTitleMinimized: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  arrowWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    right: 12,
    paddingHorizontal: 4,
  },
  arrowWrapperExpanded: { right: 20 },
  arrowWrapperCollapsed: { right: 12 },
  miniPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  tabTextActive: { color: '#FF8000', fontWeight: '700' },
  contentArea: { flex: 1, alignItems: 'center', marginTop: 80 },
  audioContainer: { alignItems: 'center' },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  webviewContainer: {
    width: '90%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'black',
    marginTop: 20,
  },
  musicImage: { width: 400, height: 200, marginBottom: 10 },
  musicTitle: { color: 'white', fontWeight: 'bold', fontSize: 20, paddingTop: 20 },
  musicSubtitle: { color: 'white', fontSize: 16,  marginTop:5},
});
