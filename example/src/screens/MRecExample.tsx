import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Platform, StyleSheet, View, Button, Text, Animated } from 'react-native';
import {
  AdView, AdViewSize,
  type AdViewRef, type AdViewLoaded, type AdViewFailed, type AdImpression
} from 'react-native-cas';

export default function MRecExample() {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const adRef = useRef<AdViewRef>(null);
  const translateY = useRef(new Animated.Value(320)).current;
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLoaded(false);
    adRef.current?.loadAd();
  }, []);

  useEffect(() => {
    const anim = Animated.timing(translateY, {
      toValue: visible && loaded ? 0 : 320,
      duration: visible && loaded ? 180 : 160,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [visible, loaded, translateY]);

  const onLoaded = useCallback((data: AdViewLoaded) => {
    setLoaded(true);
    if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null; }
    console.log('MREC loaded', data);
  }, []);

  const onFailed = useCallback((err: AdViewFailed) => {
    setLoaded(false);
    console.log('MREC failed', err);
    if (retryRef.current) clearTimeout(retryRef.current);
    retryRef.current = setTimeout(() => {
      retryRef.current = null;
      adRef.current?.loadAd();
    }, 2000);
  }, []);

  const onClicked = useCallback(() => console.log('MREC clicked'), []);
  const onImpression = useCallback((info: AdImpression) => {
    console.log('MREC impression', info);
  }, []);

  useEffect(() => {
    return () => {
      if (retryRef.current) clearTimeout(retryRef.current);
      retryRef.current = null;
      adRef.current?.destroy?.();
    };
  }, []);

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>MREC</Text>
        <View style={S.stack}>
          <Button title={visible ? 'Hide MREC' : 'Show MREC'} onPress={() => setVisible(v => !v)} />
          <Button title="Reload (ref)" onPress={() => { setLoaded(false); adRef.current?.loadAd(); }} />
        </View>
      </View>

      <Animated.View style={[S.dock, { transform: [{ translateY }] }]} pointerEvents={visible ? 'auto' : 'none'}>
        <View style={S.centerRow}>
          <AdView
            ref={adRef}
            size={AdViewSize.MREC}
            loadOnMount={false}
            refreshInterval={30}
            style={S.mrec}
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
  dock: { position: 'absolute', left: 0, right: 0, bottom: Platform.select({ ios: 36, android: 0 }), paddingVertical: 6 },
  centerRow: { width: '100%', alignItems: 'center' },
  mrec: { alignSelf: 'center' },
});
