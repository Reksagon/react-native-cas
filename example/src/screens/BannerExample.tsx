import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Platform, StyleSheet, View, Button, Text, Animated } from 'react-native';
import {
  AdView, AdViewSize, CASMobileAds,
  type AdViewRef, type AdViewLoaded, type AdViewFailed, type AdImpression
} from 'react-native-cas';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BannerExample() {
  const insets = useSafeAreaInsets();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const bannerRef = useRef<AdViewRef>(null);
  const translateY = useRef(new Animated.Value(120)).current;
  const retryId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ok = await CASMobileAds.isInitialized();
        if (mounted) setReady(ok);
      } catch {
        if (mounted) setReady(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (ready && bannerRef.current) {
      setLoaded(false);
      bannerRef.current.loadAd();
    }
  }, [ready]);

  useEffect(() => {
    if (visible && !loaded && ready && bannerRef.current) {
      bannerRef.current.loadAd();
    }
  }, [visible, loaded, ready]);

  useEffect(() => {
    const anim = Animated.timing(translateY, {
      toValue: visible && loaded ? 0 : 120,
      duration: visible && loaded ? 180 : 160,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [visible, loaded, translateY]);

  const onLoaded = useCallback((data: AdViewLoaded) => {
    setLoaded(true);
    if (retryId.current) { clearTimeout(retryId.current); retryId.current = null; }
    console.log('Banner loaded', data);
  }, []);

  const onFailed = useCallback((err: AdViewFailed) => {
    setLoaded(false);
    console.log('Banner failed', err);
    if (retryId.current) clearTimeout(retryId.current);
    retryId.current = setTimeout(() => {
      retryId.current = null;
      bannerRef.current?.loadAd(); 
    }, 2000);
  }, []);

  const onClicked = useCallback(() => console.log('Banner clicked'), []);
  const onImpression = useCallback((info: AdImpression) => {
    console.log('Banner impression', info);
  }, []);

  useEffect(() => {
    return () => {
      if (retryId.current) clearTimeout(retryId.current);
      retryId.current = null;
      bannerRef.current?.destroy?.();
    };
  }, []);

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
            onPress={() => {
              setLoaded(false);
              bannerRef.current?.loadAd(); 
            }}
          />
        </View>
      </View>

      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
       style={[
          S.dock,
          {
            paddingBottom: (insets.bottom || 0) + 6,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={S.bannerBox}>
          <AdView
            ref={bannerRef}
            size={AdViewSize.BANNER}
            loadOnMount={false}          
            autoloadReload={true}
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 20, android: 12 }),
    paddingBottom: Platform.select({ ios: 24, android: 16 }),
    backgroundColor: '#0B0F14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#121821',
    padding: 20, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 12 },
  stack: { gap: 12 },
  dock: { position: 'absolute', left: 0, right: 0, bottom: Platform.select({ ios: 36, android: 0 }), backgroundColor: '#000', paddingVertical: 6 },
  bannerBox: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  bannerExact: { width: 320, height: 50, alignSelf: 'center' },
});
