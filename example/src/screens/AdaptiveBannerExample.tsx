import React, { useEffect, useState, useCallback } from 'react';
import { Platform, StyleSheet, View, Button, Text, NativeSyntheticEvent } from 'react-native';
import { AdView, AdViewSize, CASMobileAds } from 'react-native-cas';

type OnFailedEvent = { code: number; message: string };
type OnLoadedEvent = { width?: number; height?: number };
type OnImpressionEvent = { impression: {
  format: string; revenue: number; revenuePrecision: string;
  sourceUnitId: string; sourceName: string; creativeId?: string;
  revenueTotal: number; impressionDepth: number;
} };

export default function AdaptiveBannerExample() {
  const [ready, setReady] = useState(false);
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try { const ok = await CASMobileAds.isInitialized(); if (mounted) setReady(ok); }
      catch { if (mounted) setReady(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const onLoaded = useCallback((e?: NativeSyntheticEvent<OnLoadedEvent>) => {
    const { width, height } = e?.nativeEvent ?? {};
    console.log('Adaptive loaded', { width, height });
  }, []);
  const onFailed = useCallback((e: NativeSyntheticEvent<OnFailedEvent>) => {
    const { code, message } = e.nativeEvent;
    console.log('Adaptive failed', { code, message });
  }, []);
  const onClicked = useCallback(() => console.log('Adaptive clicked'), []);
  const onImpression = useCallback(
    (e: NativeSyntheticEvent<OnImpressionEvent>) => console.log('Adaptive impression', e.nativeEvent.impression),
    []
  );

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Adaptive Banner</Text>
        <View style={S.stack}>
          <Button
            title={isShowing ? 'Hide Adaptive Banner' : 'Show Adaptive Banner'}
            disabled={!ready}
            onPress={() => setIsShowing(s => !s)}
          />
        </View>
      </View>

      {isShowing && (
        <View style={S.dock} pointerEvents="box-none">
          <AdView
            size={AdViewSize.ADAPTIVE}
            refreshInterval={30}
            style={S.banner}
            onAdViewLoaded={onLoaded}
            onAdViewFailed={onFailed}
            onAdViewClicked={onClicked}
            onAdViewImpression={onImpression}
          />
        </View>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1, paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 20, android: 12 }),
    paddingBottom: Platform.select({ ios: 24, android: 16 }),
    backgroundColor: '#0B0F14', alignItems: 'center', justifyContent: 'center',
  },
  card: {
    width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#121821',
    padding: 20, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#A5B3C5', textAlign: 'center', marginBottom: 16 },
  stack: { gap: 12 },
  dock: {
    position: 'absolute', left: 0, right: 0,
    bottom: Platform.select({ ios: 36, android: 0 }),
    width: '100%', backgroundColor: '#000', paddingVertical: 6,
    elevation: 8, zIndex: 999,
  },
  banner: { alignSelf: 'center' },
});
