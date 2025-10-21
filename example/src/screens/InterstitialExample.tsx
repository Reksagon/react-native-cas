import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppButton from '../components/AppButton';
import { InterstitialAd, type AdError, type AdContentInfo } from 'react-native-cas';

const isAutoloadEnabled = false as const;

export default function InterstitialExample() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const retry = useRef(0);

  useEffect(() => {
    (InterstitialAd as any).setAutoloadEnabled?.(isAutoloadEnabled);

    const onLoaded = () => {
      console.log('[Interstitial] LOADED');
      setLoaded(true);
      setLoading(false);
      retry.current = 0;
    };

    const onLoadFailed = (e: AdError) => {
      console.log('[Interstitial] LOAD_FAILED', e);
      setLoaded(false);
      if (isAutoloadEnabled) {
        setLoading(true);
      } else {
        setLoading(false);
        retry.current = Math.min(retry.current + 1, 6);
        const delay = Math.min(64, 2 ** retry.current);
        setTimeout(() => InterstitialAd.loadAd(), delay * 1000);
      }
    };

    const offLoaded = InterstitialAd.addAdLoadedEventListener(onLoaded);
    const offLoadFailed = InterstitialAd.addAdLoadFailedEventListener(onLoadFailed);
    const offClicked = InterstitialAd.addAdClickedEventListener(() => console.log('[Interstitial] CLICKED'));
    const offDisplayed = InterstitialAd.addAdShowedEventListener(() => console.log('[Interstitial] SHOWED'));
    const offFailShow = InterstitialAd.addAdFailedToShowEventListener((e: AdError) => {
      console.log('[Interstitial] FAILED_TO_SHOW', e);
      if (isAutoloadEnabled) setLoading(true);
      else InterstitialAd.loadAd();
    });
    const offHidden = InterstitialAd.addAdDismissedEventListener(() => {
      console.log('[Interstitial] DISMISSED');
      setLoaded(false);
      if (isAutoloadEnabled) setLoading(true);
    });
    const offImpression = InterstitialAd.addAdImpressionEventListener((i: AdContentInfo) => console.log('[Interstitial] IMPRESSION', i));
    setLoading(true);
    InterstitialAd.loadAd();

    return () => { offLoaded(); offLoadFailed(); offClicked(); offDisplayed(); offFailShow(); offHidden(); offImpression(); };
  }, []);

  const onLoad = () => {
    if (isAutoloadEnabled || loading || loaded) return; 
    setLoading(true);
    InterstitialAd.loadAd();
  };

  const onShow = async () => {
    if (await InterstitialAd.isAdLoaded()) {
      setLoaded(false);
      if (isAutoloadEnabled) setLoading(true); 
      InterstitialAd.showAd();
    }
  };

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Interstitial</Text>

        <View style={S.row}>
          <AppButton
            title={loading ? (isAutoloadEnabled ? 'Auto…' : 'Loading…') : 'Load'}
            onPress={onLoad}
            enabled={!isAutoloadEnabled && !loaded && !loading}
          />
          <AppButton title="Show" onPress={onShow} enabled={loaded} />
        </View>

        <View style={S.status}>
          {loading && <ActivityIndicator />}
        </View>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, backgroundColor: '#0B0F14', alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#121821', padding: 20, elevation: 6 },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  status: { marginTop: 12, alignItems: 'center', gap: 8 },
  state: { color: '#A5B3C5' },
});
