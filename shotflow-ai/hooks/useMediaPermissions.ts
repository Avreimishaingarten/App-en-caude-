import { useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';

export function useMediaPermissions() {
  const [status, setStatus] = useState<MediaLibrary.PermissionStatus | null>(null);

  const request = useCallback(async () => {
    const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
    setStatus(newStatus);
    return newStatus === 'granted';
  }, []);

  const check = useCallback(async () => {
    const { status: currentStatus } = await MediaLibrary.getPermissionsAsync();
    setStatus(currentStatus);
    return currentStatus === 'granted';
  }, []);

  return {
    status,
    isGranted: status === 'granted',
    isDenied: status === 'denied',
    request,
    check,
  };
}
