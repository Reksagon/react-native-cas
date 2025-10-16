import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import { InterstitialAd, type AdError } from 'react-native-cas';

const MAX_RETRY = 6 as const;

export default function InterstitialExample() {
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle');
  const retry = useRef(0);

  useEffect(() => {
    const onLoaded = () => { setState('ready'); retry.current = 0; };
    const onFailed = (_e: AdError) => {
      setState('idle');
      if (retry.current >= MAX_RETRY) return;
      retry.current += 1;
      const delay = Math.min(64, 2 ** retry.current);
      setTimeout(() => { setState('loading'); InterstitialAd.loadAd(); }, delay * 1000);
    };
    InterstitialAd.addAdLoadedEventListener(onLoaded);
    InterstitialAd.addAdLoadFailedEventListener(onFailed);
    InterstitialAd.addAdDismissedEventListener(() => setState('idle'));
    return () => {
      InterstitialAd.removeAdLoadedEventListener();
      InterstitialAd.removeAdLoadFailedEventListener();
      InterstitialAd.removeAdDismissedEventListener();
    };
  }, []);

  const onPress = async () => {
    if (await InterstitialAd.isAdLoaded()) InterstitialAd.showAd();
    else { setState('loading'); InterstitialAd.loadAd(); }
  };

  const title = state === 'ready' ? 'Show Interstitial' : state === 'loading' ? 'Loading…' : 'Load Interstitial';

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Interstitial</Text>
        <Text style={S.subtitle}>Load or show when ready</Text>
        <View style={S.stack}>
          <AppButton title={title} onPress={onPress} enabled={state !== 'loading'} />
        </View>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, backgroundColor: '#0B0F14', alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#121821', padding: 20, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#A5B3C5', textAlign: 'center', marginBottom: 16 },
  stack: { gap: 12 },
});
