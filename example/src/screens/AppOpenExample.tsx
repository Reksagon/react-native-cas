import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import AppButton from '../components/AppButton';
import { AppOpenAd, type AdError, type AdContentInfo } from 'react-native-cas';

const isAutoloadEnabled = false as const; 

export default function AppOpenExample() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const retry = useRef(0);

  useEffect(() => {
    (AppOpenAd as any).setAutoloadEnabled?.(isAutoloadEnabled);

    const onLoaded = () => {
      console.log('[AppOpen] LOADED');
      setLoaded(true);
      setLoading(false);
      retry.current = 0;
    };

    const onLoadFailed = (e: AdError) => {
      console.log('[AppOpen] LOAD_FAILED', e);
      setLoaded(false);
      if (isAutoloadEnabled) {
        setLoading(true);
      } else {
        setLoading(false);
        retry.current = Math.min(retry.current + 1, 6);
        const delay = Math.min(64, 2 ** retry.current);
        setTimeout(() => AppOpenAd.loadAd(), delay * 1000);
      }
    };

    const offLoaded = AppOpenAd.addAdLoadedEventListener(onLoaded);
    const offLoadFailed = AppOpenAd.addAdLoadFailedEventListener(onLoadFailed);
    const offClicked = AppOpenAd.addAdClickedEventListener(() => console.log('[AppOpen] CLICKED'));
    const offDisplayed = AppOpenAd.addAdShowedEventListener(() => console.log('[AppOpen] SHOWED'));
    const offFailShow = AppOpenAd.addAdFailedToShowEventListener((e: AdError) => {
      console.log('[AppOpen] FAILED_TO_SHOW', e);
      if (isAutoloadEnabled) setLoading(true);
      else AppOpenAd.loadAd();
    });
    const offHidden = AppOpenAd.addAdDismissedEventListener(() => {
      console.log('[AppOpen] DISMISSED');
      setLoaded(false);
      if (isAutoloadEnabled) setLoading(true); 
    });
    const offImpression = AppOpenAd.addAdImpressionEventListener((i: AdContentInfo) => console.log('[AppOpen] IMPRESSION', i));

    setLoading(true);
    AppOpenAd.loadAd();

    return () => { offLoaded(); offLoadFailed(); offClicked(); offDisplayed(); offFailShow(); offHidden(); offImpression(); };
  }, []);

  const onLoad = () => {
    if (isAutoloadEnabled || loading || loaded) return;
    setLoading(true);
    AppOpenAd.loadAd();
  };

  const onShow = async () => {
    if (await AppOpenAd.isAdLoaded()) {
      setLoaded(false);
      if (isAutoloadEnabled) setLoading(true);
      AppOpenAd.showAd();
    }
  };

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>App Open</Text>

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
