import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import { InterstitialAd, type AdError, type AdContentInfo } from 'react-native-cas';

const isAutoloadEnabled = false as const;

export default function InterstitialExample() {
  const [loaded, setLoaded] = useState(false);
  const retry = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (InterstitialAd as any).setAutoloadEnabled?.(isAutoloadEnabled);

    const offLoaded = InterstitialAd.addAdLoadedEventListener(() => {
      console.log('[Interstitial] LOADED');
      setLoaded(true);
      retry.current = 0;
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    });

    const offLoadFailed = InterstitialAd.addAdLoadFailedEventListener((e: AdError) => {
      console.log('[Interstitial] LOAD_FAILED', e);
      setLoaded(false);
      if (isAutoloadEnabled) {
        // just wait auto reload
      } else {
        retry.current = Math.min(retry.current + 1, 6);
        const delay = Math.min(64, 2 ** retry.current);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => { timerRef.current = null; InterstitialAd.loadAd(); }, delay * 1000);
      }
    });

    const offClicked = InterstitialAd.addAdClickedEventListener(() => console.log('[Interstitial] CLICKED'));
    const offDisplayed = InterstitialAd.addAdShowedEventListener(() => console.log('[Interstitial] SHOWED'));
    const offFailShow = InterstitialAd.addAdFailedToShowEventListener((e: AdError) => {
      console.log('[Interstitial] FAILED_TO_SHOW', e);
      setLoaded(false);
      if (isAutoloadEnabled) {
        // just wait auto reload
      } else {
        InterstitialAd.loadAd(); 
      }
    });
    const offHidden = InterstitialAd.addAdDismissedEventListener(() => {
      console.log('[Interstitial] DISMISSED');
      setLoaded(false);
      if (isAutoloadEnabled) {
        // just wait auto reload
      } else {
        InterstitialAd.loadAd(); 
      }
    });
    const offImpression = InterstitialAd.addAdImpressionEventListener((i: AdContentInfo) => console.log('[Interstitial] IMPRESSION', i));

    InterstitialAd.loadAd();

    return () => {
      offLoaded(); offLoadFailed(); offClicked(); offDisplayed(); offFailShow(); offHidden(); offImpression();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onLoad = () => InterstitialAd.loadAd();

  const onShow = async () => {
    if (await InterstitialAd.isAdLoaded()) {
      setLoaded(false);
      InterstitialAd.showAd();
    }
  };

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Interstitial</Text>
        <View style={S.row}>
          <AppButton title="Load" onPress={onLoad} />
          <AppButton title="Show" onPress={onShow} enabled={loaded} />
        </View>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, backgroundColor: '#0B0F14', alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#121821', padding: 20, elevation: 6 },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 8 },
});
