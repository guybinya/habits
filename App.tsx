import { StatusBar } from 'expo-status-bar';
import React, {useCallback} from 'react';
import Home from './components/Screens/Home'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {useFonts} from "expo-font";


export default function App() {
  const [fontsLoaded] = useFonts({
    'VesperLibre-Bold': require('./assets/fonts/VesperLibre-Bold.ttf'),
    'NotoSans-Regular': require('./assets/fonts/NotoSans-Regular.ttf')
  });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={'auto'} />
      <Home />
    </SafeAreaProvider>
  );
}
