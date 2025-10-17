import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Platform, StyleSheet, View, Button, Text, NativeSyntheticEvent, Animated } from 'react-native';
import { AdView, AdViewSize, CASMobileAds, type AdViewRef } from 'react-native-cas';

type OnFailedEvent = { code: number; message: string };
type OnLoadedEvent = { width?: number; height?: number };
type OnImpressionEvent = { impression: {
  format: string; revenue: number; revenuePrecision: string;
  sourceUnitId: string; sourceName: string; creativeId?: string;
  revenueTotal: number; impressionDepth: number;
} };

export default function BannerExample() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);   
  const [loaded, setLoaded] = useState(false);     
  const bannerRef = useRef<AdViewRef>(null);
  const translateY = useRef(new Animated.Value(120)).current; 

  useEffect(() => {
    let mounted = true;
    (async () => {
      try { const ok = await CASMobileAds.isInitialized(); if (mounted) setReady(ok); }
      catch { if (mounted) setReady(false); }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (ready) {
      setLoaded(false);
      bannerRef.current?.loadAd();
    }
  }, [ready]);

  useEffect(() => {
    if (visible && loaded) {
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    } else {
      Animated.timing(translateY, { toValue: 120, duration: 160, useNativeDriver: true }).start();
    }
  }, [visible, loaded, translateY]);

  const onLoaded = useCallback((e?: NativeSyntheticEvent<OnLoadedEvent>) => {
    const { width, height } = e?.nativeEvent ?? {};
    setLoaded(true);
    console.log('Banner loaded', { width, height });
  }, []);

  const onFailed = useCallback((e: NativeSyntheticEvent<OnFailedEvent>) => {
    const { code, message } = e.nativeEvent;
    setLoaded(false);
    console.log('Banner failed', { code, message });
    setTimeout(() => bannerRef.current?.loadAd(), 2000);
  }, []);

  const onClicked = useCallback(() => console.log('Banner clicked'), []);
  const onImpression = useCallback(
    (e: NativeSyntheticEvent<OnImpressionEvent>) => console.log('Banner impression', e.nativeEvent.impression),
    []
  );

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Banner</Text>
        <View style={S.stack}>
          <Button
            title={visible ? 'Hide Banner' : 'Show Banner'}
            disabled={!ready}
            onPress={() => setVisible(v => !v)}
          />
          <Button
            title="Reload (ref)"
            onPress={() => { setLoaded(false); bannerRef.current?.loadAd(); }}
          />
        </View>
      </View>


      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[S.dock, { transform: [{ translateY }] }]}
      >
        <View style={S.bannerBox}>
          <AdView
            ref={bannerRef}
            size={AdViewSize.BANNER}
            loadOnMount={false}         
            isAutoloadEnabled={true}
            refreshInterval={30}
            style={S.bannerExact}
            onAdViewLoaded={onLoaded}
            onAdViewFailed={onFailed}
            onAdViewClicked={onClicked}
            onAdViewImpression={onImpression}
          />
        </View>
      </Animated.View>
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
  stack: { gap: 12 },
  dock: {
    position: 'absolute', left: 0, right: 0,
    bottom: Platform.select({ ios: 36, android: 0 }),
    backgroundColor: '#000', paddingVertical: 6,
  },
  bannerBox: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  bannerExact: { width: 320, height: 50, alignSelf: 'center' },
});
