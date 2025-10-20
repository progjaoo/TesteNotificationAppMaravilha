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
  Linking,
  PanResponder,
  Platform,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getRadioInfo } from '../api/radioService';
import SocialLinks from '../components/SocialLinks';
import { styles } from '../styles/index.styles';

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
  const [interprete, setInterprete] = useState('');
  const [capa, setCapa] = useState<string | null>(null);

  const getSheetPositionCollapsed = () =>
    Platform.select({
      ios: height * 0.75,
      android: height * 0.8,
      default: height * 0.8,
    })!;

  const getSheetPositionExpanded = () => 0;

  const borderRadius = translateY.interpolate({
    inputRange: [getSheetPositionExpanded(), getSheetPositionCollapsed()],
    outputRange: [0, 24],
    extrapolate: 'clamp',
  });
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        let newValue;
        if (expanded) newValue = gestureState.dy;
        else newValue = getSheetPositionCollapsed() + gestureState.dy;

        if (
          newValue >= getSheetPositionExpanded() &&
          newValue <= getSheetPositionCollapsed()
        ) {
          translateY.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = height * 0.4;
        let currentPosition = expanded
          ? gestureState.dy
          : getSheetPositionCollapsed() + gestureState.dy;

        const shouldExpand =
          currentPosition < threshold || gestureState.vy < -0.5;
        const shouldCollapse =
          currentPosition > threshold || gestureState.vy > 0.5;

        const targetPosition = shouldExpand
          ? getSheetPositionExpanded()
          : shouldCollapse
          ? getSheetPositionCollapsed()
          : expanded
          ? getSheetPositionExpanded()
          : getSheetPositionCollapsed();

        Animated.spring(translateY, {
          toValue: targetPosition,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }).start();

        setExpanded(targetPosition === getSheetPositionExpanded());
      },
    })
  ).current;

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false
        });
      } catch (e) {
        console.log('Erro ao configurar áudio:', e);
      }
    })();

    const fetchRadioInfo = async () => {
      const info = await getRadioInfo();
      if (info) {
        setMusicaAtual(info.musica_atual || '-');
        setTitulo(info.titulo || '');
        setGenero(info.genero || '');
        setCapa(info.capa_musica || null);
      }
    };

    fetchRadioInfo();
    const interval = setInterval(fetchRadioInfo, 20000);
    return () => clearInterval(interval);
  }, []);

  // ▶️ Controle do áudio
  const togglePlay = async () => {
    try {
      if (!soundRef.current) {
        setLoading(true);
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://stm19.srvstm.com:7080/stream' },
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

  const pauseAudioIfPlaying = async () => {
    if (soundRef.current && isPlaying) {
      try {
        await soundRef.current.pauseAsync();
      } catch (e) {
        console.warn('Erro ao pausar áudio:', e);
      }
      setIsPlaying(false);
    }
  };

  // ⏹️ Ao mudar pra “Assistir”, pausa o áudio
  const handleTabChange = async (tab: 'ouvir' | 'assistir') => {
    if (tab === 'assistir') {
      await pauseAudioIfPlaying();
    }
    setActiveTab(tab);
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
    const iosLink = 'https://apps.apple.com/app/id6748237407'; 
    const androidLink = 'https://play.google.com/store/apps/details?id=com.claitonbarbosa.maravilhafmbh'; 

    const appLink = Platform.OS === 'ios' ? iosLink : androidLink;

    await Share.share({
      message: `🎶 Ouça agora a Rádio Maravilha - 89.1 FM! Baixe o app no seu celular: ${appLink}`,
    });
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
  }
};

  const openRadioSite = async () => {
    const url = 'https://89maravilhafm.com/sorteio/';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn("Can't open URL:", url);
      }
    } catch (e) {
      console.error('Erro ao abrir o link:', e);
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
                source={require('../../assets/maravilhabranco.png')}
                style={styles.logoHeader}
              />

              <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                <Ionicons name="share-social-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.mainContent}>
        <TouchableOpacity
          onPress={openRadioSite}
          accessibilityRole="link"
          accessibilityLabel="Abrir site da rádio"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../../assets/sorteio.png')}
            style={styles.logocentro}
            resizeMode="contain"
          />
        </TouchableOpacity>

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
        {/* HEADER */}
        <View {...panResponder.panHandlers}>
          <TouchableOpacity
            onPress={toggleSheet}
            activeOpacity={0.9}
            style={styles.sheetHeader}
          >
            <View style={styles.dragIndicator} />

            {/* 🎵 Mini player quando minimizado */}
            {!expanded && (
              <View style={styles.headerLeft}>
                <TouchableOpacity onPress={togglePlay} style={styles.miniPlayButton}>
                  {loading ? (
                    <ActivityIndicator color="#FF8000" />
                  ) : (
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#FF8000" />
                  )}
                </TouchableOpacity>
                <Text style={styles.sheetTitleMinimized}>Ouça Ao Vivo</Text>
              </View>
            )}

            {!expanded && (
              <View style={styles.arrowWrapperCollapsed}>
                <Ionicons name="chevron-up" size={28} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {expanded && (
            <TouchableOpacity onPress={toggleSheet} style={styles.inicioButton}>
              <Text style={styles.inicioButtonText}>Recolher</Text>
              <Ionicons name="chevron-down" size={20} color="#fff" style={styles.setaInicio}></Ionicons>
            </TouchableOpacity>
          )}
        </View>

        {expanded && (
          <>
            {/* CONTEÚDO */}
            <View style={styles.contentArea}>
              {activeTab === 'ouvir' ? (
                <View style={styles.audioContainer}>
                  <Image
                    source={require('../../assets/musica.png')}
                    style={styles.musicImage}
                    resizeMode="contain"
                  />
                  {(() => {
                    const nomeMusica = musicaAtual?.trim() || '';

                    const isInvalido =
                      nomeMusica === '-' ||
                      nomeMusica === '' ||
                      nomeMusica.toLowerCase().includes('radio maravilha fm') ||
                      nomeMusica.startsWith('891');

                    if (isInvalido) {
                      return (
                        <Text style={[styles.musicSubtitle, { textAlign: 'center', marginTop: 10 }]}>
                          89.1 - Rádio Maravilha FM{'\n'} 
                          {'\n'}
                          A Rádio de todas as igrejas{'\n'}que toca o som do céu
                        </Text>
                      );
                    }
                    const [musica, artista] = nomeMusica.split(' - ');
                    return (
                      <>
                        <Text style={styles.musicTitle}>{musica?.trim() || ''}</Text>
                        {artista ? (
                          <Text style={styles.musicArtist}>{artista.trim()}</Text>
                        ) : null}
                      </>
                    );
                  })()}


                  <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
                    {loading ? (
                      <ActivityIndicator color="#FF8000" />
                    ) : (
                      <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#FF8000" />
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.webviewContainer}>
                  <WebView source={{ html: playerHTML }} allowsFullscreenVideo />
                </View>
              )}
            </View>
            {/* TABS */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'ouvir' && styles.tabActive,
                  activeTab === 'ouvir' && { marginBottom: 5 },
                ]}
                onPress={() => handleTabChange('ouvir')}
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
                onPress={() => handleTabChange('assistir')}
              >
                <Text style={[styles.tabText, activeTab === 'assistir' && styles.tabTextActive]}>
                  Assistir
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}