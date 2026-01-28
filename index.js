import '@expo/metro-runtime';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './src/services/playbackService';

renderRootComponent(App);
TrackPlayer.registerPlaybackService(() => playbackService);
