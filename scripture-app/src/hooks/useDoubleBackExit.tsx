import { useCallback, useEffect, useRef } from 'react';
import { BackHandler, Platform, ToastAndroid, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';

export function useDoubleBackExit() {
  const lastPress = useRef(0);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      const onBack = () => {
        const now = Date.now();
        if (now - lastPress.current < 2000) {
          BackHandler.exitApp();
          return true;
        }
        lastPress.current = now;
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        return true;
      };

      const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => sub.remove();
    }, []),
  );
}