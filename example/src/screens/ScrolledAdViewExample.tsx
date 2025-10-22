import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import {
  BannerAdView, BannerAdSize,
  type BannerAdViewRef, type AdViewInfo, type AdError
} from 'react-native-cas';

const REPEATS = 2;
const TXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

const SAFE_BOTTOM = Platform.OS === 'android' ? 12 : 8;

function InlineAdPreloaded({ size }: { size: BannerAdSize }) {
  const ref = useRef<BannerAdViewRef>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ref.current?.loadAd();
    return () => {
      mountedRef.current = false;
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, []);

  const onLoaded = useCallback((_: AdViewInfo) => {
    if (!mountedRef.current) return;
    if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null; }
    setLoaded(true);
  }, []);

  const onFailed = useCallback((err: AdError) => {
    if (!mountedRef.current) return;
    if (retryRef.current) clearTimeout(retryRef.current);
    retryRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      retryRef.current = null;
      ref.current?.loadAd();
    }, 10000);
  }, []);

  return (
    <View
      style={[S.slot, !loaded && S.slotCollapsed, loaded && { marginBottom: SAFE_BOTTOM }]}
    >
      <View
        style={[S.center, !loaded && S.offscreen]}
      >
        <BannerAdView
          ref={ref}
          size={size}
          autoload={false}
          refreshInterval={30}
          onAdViewLoaded={onLoaded}
          onAdViewFailed={onFailed}
        />
      </View>
    </View>
  );
}

export default function ScrolledAdViewExample() {
  const [showAds, setShowAds] = useState(true);

  const block = (key: string, node: JSX.Element) => (
    <View key={key} style={{ marginBottom: 16 }}>
      <Text style={S.p}>{TXT}</Text>
      {showAds ? node : <Text style={S.placeholder}>AD PLACEHOLDER</Text>}
    </View>
  );

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Scrolled AdViews</Text>
        <Text style={S.subtitle}>Inline banner & MREC inside scroll</Text>

        <View style={[S.stack, { marginBottom: 12 }]}>
          <AppButton title={showAds ? 'Hide Ads' : 'Show Ads'} onPress={() => setShowAds(v => !v)} />
        </View>

        <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
          {Array.from({ length: REPEATS }).flatMap((_, i) => [
            block(`b-${i}`, <InlineAdPreloaded size={BannerAdSize.BANNER} />),
            block(`m-${i}`, <InlineAdPreloaded size={BannerAdSize.MREC} />),
          ])}
        </ScrollView>

        <View style={{ marginTop: 12, alignItems: 'center', alignSelf: 'stretch' }}>
          {showAds ? <InlineAdPreloaded size={BannerAdSize.BANNER} /> : <Text style={S.placeholder}>Placeholder</Text>}
        </View>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24,
    backgroundColor: '#0B0F14', alignItems: 'center', justifyContent: 'center',
  },
  card: {
    width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#121821',
    padding: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#A5B3C5', textAlign: 'center', marginBottom: 16 },
  stack: { gap: 12 },
  p: { margin: 8, fontSize: 16, color: '#E8EEF6' },

  slot: { width: '100%' },
  slotCollapsed: { height: 0, overflow: 'hidden' },

  offscreen: { position: 'absolute', left: -9999, top: 0 },
  center: { alignItems: 'center' },

  placeholder: {
    marginTop: 10, backgroundColor: '#223044', color: '#E8EEF6',
    fontSize: 16, textAlign: 'center', height: 50, textAlignVertical: 'center',
    borderRadius: 8,
  },
});
