import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { ToastProvider } from '@/context/ToastProvider';
import { useEffect } from 'react';
import Index from '.';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // This is where you load assets and resources
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <ToastProvider duration={3000}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Index />
      </ThemeProvider>
    </ToastProvider>
  );
}
