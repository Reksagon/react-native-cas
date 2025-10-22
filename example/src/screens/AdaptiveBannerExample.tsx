import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Platform, StyleSheet, View, Button, Text, Animated } from 'react-native';
import { BannerAdView, BannerAdSize, type BannerAdViewRef, type AdViewInfo, type AdError, type AdContentInfo } from 'react-native-cas';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdaptiveBannerExample() {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const bannerRef = useRef<BannerAdViewRef>(null);
  const translateY = useRef(new Animated.Value(120)).current;
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bannerRef.current.loadAd();
  }, []);

  useEffect(() => {
    const anim = Animated.timing(translateY, {
      toValue: visible && loaded ? 0 : 120,
      duration: visible && loaded ? 180 : 160,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [visible, loaded, translateY]);

  const onLoaded = useCallback((info: AdViewInfo) => {
    setLoaded(true);
    if (retryRef.current) {
      clearTimeout(retryRef.current);
      retryRef.current = null;
    }
    console.log('Adaptive loaded', info);
  }, []);

  const onFailed = useCallback((error: AdError) => {
    setLoaded(false);
    console.log('Adaptive failed', error);
    if (retryRef.current) clearTimeout(retryRef.current);
    retryRef.current = setTimeout(() => {
      retryRef.current = null;
      bannerRef.current?.loadAd();
    }, 10000);
  }, []);

  const onClicked = useCallback(() => console.log('Adaptive clicked'), []);
  const onImpression = useCallback((info: AdContentInfo) => {
    console.log('Adaptive impression', info);
  }, []);

  useEffect(() => {
    return () => {
      if (retryRef.current) clearTimeout(retryRef.current);
      retryRef.current = null;
    };
  }, []);

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Adaptive Banner</Text>
        <View style={S.stack}>
          <Button title={visible ? 'Hide Adaptive Banner' : 'Show Adaptive Banner'} disabled={!ready} onPress={() => setVisible((v) => !v)} />
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
        style={[
          S.dock,
          {
            paddingBottom: (insets.bottom || 0) + 16,
            transform: [{ translateY }],
          },
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <BannerAdView
          ref={bannerRef}
          size={BannerAdSize.ADAPTIVE}
          autoload={false}
          refreshInterval={30}
          style={S.banner}
          onAdViewLoaded={onLoaded}
          onAdViewFailed={onFailed}
          onAdViewClicked={onClicked}
          onAdViewImpression={onImpression}
        />
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
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: '#121821',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#A5B3C5', textAlign: 'center', marginBottom: 16 },
  stack: { gap: 12 },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.select({ ios: 36, android: 0 }),
    width: '100%',
    backgroundColor: '#000',
    paddingVertical: 6,
    elevation: 8,
    zIndex: 999,
  },
  banner: { alignSelf: 'center' },
});
