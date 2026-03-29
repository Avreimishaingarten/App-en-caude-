import * as MediaLibrary from 'expo-media-library';
import { Platform, Linking } from 'react-native';

export async function checkMediaPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.getPermissionsAsync();
  return status === 'granted';
}

export async function requestMediaPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
}

export async function openAppSettings(): Promise<void> {
  if (Platform.OS === 'ios') {
    await Linking.openURL('app-settings:');
  } else {
    await Linking.openSettings();
  }
}
