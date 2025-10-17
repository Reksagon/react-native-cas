import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CasProvider } from './context/CasContext';

import SetupScreen from './screens/SetupScreen';
import MenuScreen from './screens/MenuScreen';

import InterstitialExample from './screens/InterstitialExample';
import RewardedExample from './screens/RewardedExample';
import AppOpenExample from './screens/AppOpenExample';

import NativeBannerExample from './screens/BannerExample';
import NativeMRecExample from './screens/MRecExample';
import AdaptiveBannerExample from './screens/AdaptiveBannerExample';
import ScrolledAdViewExample from './screens/ScrolledAdViewExample';

export type RootStackParamList = {
  Setup: undefined;
  Menu: undefined;
  Interstitial: undefined;
  Rewarded: undefined;
  AppOpen: undefined;
  Banner: undefined;
  MREC: undefined;
  Adaptive: undefined;
  Scrolled: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CasProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Setup">
          <Stack.Screen name="Setup" component={SetupScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />

          <Stack.Screen name="Interstitial" component={InterstitialExample} />
          <Stack.Screen name="Rewarded" component={RewardedExample} />
          <Stack.Screen name="AppOpen" component={AppOpenExample} />

          <Stack.Screen name="Banner" component={NativeBannerExample} />
          <Stack.Screen name="MREC" component={NativeMRecExample} />
          <Stack.Screen name="Adaptive" component={AdaptiveBannerExample} />
          <Stack.Screen name="Scrolled" component={ScrolledAdViewExample} />
        </Stack.Navigator>
      </NavigationContainer>
    </CasProvider>
  );
}
