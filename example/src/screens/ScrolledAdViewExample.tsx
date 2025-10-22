import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { BannerAdViewRef } from 'react-native-cas';
import { BannerAdView, BannerAdSize } from 'react-native-cas';

const REPEATS = 3;
const TXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

function InlineBannerAd() {
  const ref = useRef<BannerAdViewRef>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    ref.current?.loadAd();
    return () => {
      mountedRef.current = false;
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width;
    setWidth(newWidth);
  };

  return (
    <View style={S.slot} onLayout={handleLayout}>
      {width > 0 && (
        // Wait Width from handleLayout to start load ad
        <BannerAdView
          ref={ref}
          size={BannerAdSize.INLINE}
          maxWidth={width}
          maxHeight={300}
          autoload={true} // Use auto reload after errors
          refreshInterval={0} // Disable refresh ad
        />
      )}
    </View>
  );
}

export default function ScrolledAdViewExample() {
  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Scrolled AdViews</Text>
        <Text style={S.subtitle}>Inline banner & MREC inside scroll</Text>

        <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
          {Array.from({ length: REPEATS }).flatMap((_, i) => [
            <View key={`t-${i}`} style={{ marginBottom: 10 }}>
              <Text style={S.p}>{TXT}</Text>
            </View>,
            <View key={`b-${i}`} style={{ marginBottom: 10 }}>
              <InlineBannerAd />
            </View>,
          ])}
        </ScrollView>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#0B0F14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#121821',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#A5B3C5', textAlign: 'center', marginBottom: 16 },
  stack: { gap: 12 },
  p: { margin: 8, fontSize: 16, color: '#E8EEF6' },
  slot: { width: '100%' },
  center: { alignItems: 'center' },
});
