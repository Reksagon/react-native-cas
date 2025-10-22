import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppButton from '../components/AppButton';
import { AppOpenAd, type AdError, type AdContentInfo } from 'react-native-cas';

const isAutoloadEnabled = false as const;

export default function AppOpenExample() {
  const [loaded, setLoaded] = useState(false);
  const retry = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (AppOpenAd as any).setAutoloadEnabled?.(isAutoloadEnabled);

    const offLoaded = AppOpenAd.addAdLoadedEventListener(() => {
      console.log('[AppOpen] LOADED');
      setLoaded(true);
      retry.current = 0;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    });

    const offLoadFailed = AppOpenAd.addAdLoadFailedEventListener((e: AdError) => {
      console.log('[AppOpen] LOAD_FAILED', e);
      setLoaded(false);
      if (isAutoloadEnabled) {
        // just wait auto reload
      } else {
        retry.current = Math.min(retry.current + 1, 6);
        const delay = Math.min(64, 2 ** retry.current);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          AppOpenAd.loadAd();
        }, delay * 1000);
      }
    });

    const offClicked = AppOpenAd.addAdClickedEventListener(() => console.log('[AppOpen] CLICKED'));
    const offDisplayed = AppOpenAd.addAdShowedEventListener(() => console.log('[AppOpen] SHOWED'));
    const offFailShow = AppOpenAd.addAdFailedToShowEventListener((e: AdError) => {
      console.log('[AppOpen] FAILED_TO_SHOW', e);
      setLoaded(false);
      if (isAutoloadEnabled) {
        // just wait auto reload
      } else {
        AppOpenAd.loadAd();
      }
    });
    const offHidden = AppOpenAd.addAdDismissedEventListener(() => {
      console.log('[AppOpen] DISMISSED');
      setLoaded(false);
      if (isAutoloadEnabled) {
        // just wait auto reload
      } else {
        AppOpenAd.loadAd();
      }
    });
    const offImpression = AppOpenAd.addAdImpressionEventListener((i: AdContentInfo) => console.log('[AppOpen] IMPRESSION', i));

    AppOpenAd.loadAd();

    return () => {
      offLoaded();
      offLoadFailed();
      offClicked();
      offDisplayed();
      offFailShow();
      offHidden();
      offImpression();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onLoad = () => AppOpenAd.loadAd();

  const onShow = async () => {
    if (await AppOpenAd.isAdLoaded()) {
      setLoaded(false);
      AppOpenAd.showAd();
    }
  };

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>App Open</Text>
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
