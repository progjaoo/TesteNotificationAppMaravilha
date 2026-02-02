import '@expo/metro-runtime';
import notifee, { EventType } from '@notifee/react-native';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';

// Register Notifee background event handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  console.log('Background event received:', type);

  if (type === EventType.PRESS) {
    console.log('User pressed notification in background', notification);
  }
});

renderRootComponent(App);
