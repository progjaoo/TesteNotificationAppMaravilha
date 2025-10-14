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

  // 🎯 PanResponder — apenas no header do BottomSheet
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

  // ⚙️ Configuração inicial
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
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  // ⏹️ Ao mudar para “Assistir”, pausa o áudio
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
              <Image
                source={require('../../assets/images/logocentro.png')} //DIMINUIR 
                style={styles.logocentro}
                resizeMode="contain"
              />
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

            <View
              style={[
                styles.arrowWrapper,
                expanded ? styles.arrowWrapperExpanded : styles.arrowWrapperCollapsed,
              ]}
            >
              <Ionicons name={expanded ? 'chevron-down' : 'chevron-up'} size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {expanded && (
          <>
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
                    {'A Rádio de todas as Igrejas\nque toca o som do céu'}
                  </Text>
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