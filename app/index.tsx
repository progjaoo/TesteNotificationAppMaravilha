import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';


const { height } = Dimensions.get('window');

export default function Index() {
  const translateY = useRef(new Animated.Value(height * 0.85)).current;
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'ouvir' | 'assistir'>('ouvir');

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const togglePlay = async () => {
    try {
      if (!soundRef.current) {
        setLoading(true);
        const { sound } = await Audio.Sound.createAsync({
          uri: 'https://stm19.srvstm.com:7080/stream',
        });
        soundRef.current = sound;
        await sound.playAsync();
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
      toValue: expanded ? height * 0.8 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: height * 0.8,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, []);

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
        title: '',
        headerStyle: { backgroundColor: '#FF8000' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerRight: () => null
      }}
    />

      <View style={styles.mainContent}>
        <Ionicons name="radio" size={90} color="#FF8000" />
        <Image
          source={require('../assets/images/logomaravi.png')}
          style={styles.logo}
        />
      </View>

      <Animated.View
        style={[
          styles.bottomSheet,
          { transform: [{ translateY }] },
        ]}
      >
        <TouchableOpacity onPress={toggleSheet} activeOpacity={0.9} style={styles.sheetHeader}>
        <View style={styles.headerLeft}>
          {!expanded && (
            <TouchableOpacity onPress={togglePlay} style={styles.miniPlayButton}>
              {loading ? (
                <ActivityIndicator color="#FF8000" />
              ) : (
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={28}
                  color="#FF8000"
                />
              )}
            </TouchableOpacity>
          )}
          <Text style={styles.sheetTitle}>  Ouça Ao Vivo</Text> 
        </View>

        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-up'}
          size={28}

          color="#fff"
        />
      </TouchableOpacity>


        
        {expanded && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'ouvir' && styles.tabActive]}
              onPress={() => setActiveTab('ouvir')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'ouvir' && styles.tabTextActive,
                ]}
              >
                Ouvir
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'assistir' && styles.tabActive]}
              onPress={() => setActiveTab('assistir')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'assistir' && styles.tabTextActive,
                ]}
              >
                Assistir
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {expanded && (
          <View style={styles.contentArea}>
            {activeTab === 'ouvir' ? (
              <View style={styles.audioContainer}>
                <Image
                source={require('../assets/images/musica.png')}
                style={styles.musicImage}
              />
              <Text style={{ color:'white', fontWeight:'bold', fontSize: 20, paddingTop: 20 }}>
                Nome da Música: 
              </Text>
              <Text style={{ color:'white', fontSize: 16 }}>
                Álbum / Intérprete: 
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
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  radioName: { fontSize: 18, fontWeight: 'bold', marginTop: 12 },
  subtitle: { fontSize: 14, color: '#555' },

  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height,
    backgroundColor: '#FF8000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
  sheetTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

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
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  tabTextActive: { color: '#FF8000', fontWeight: '700' },

  contentArea: { flex: 1, alignItems: 'center', marginTop: 20 },
  audioContainer: { alignItems: 'center' },
  songTitle: { color: '#fff', fontSize: 16, marginBottom: 20 },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginTop:15
  },

  webviewContainer: {
    width: '90%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'black',
    marginTop: 20,
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
  },
  musicImage:{
    width: 400,
    height: 200,
    marginBottom:10,
    marginTop: 50,
    resizeMode: 'contain',
},
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  miniPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
