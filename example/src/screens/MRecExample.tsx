import React, { useCallback, useRef, useState } from 'react';
import { Platform, StyleSheet, View, Button, Text, NativeSyntheticEvent } from 'react-native';
import { AdView, AdViewSize, type AdViewRef } from 'react-native-cas';

type OnFailedEvent = { code: number; message: string };
type OnLoadedEvent = { width?: number; height?: number };
type OnImpressionEvent = { impression: {
  format: string; revenue: number; revenuePrecision: string;
  sourceUnitId: string; sourceName: string; creativeId?: string;
  revenueTotal: number; impressionDepth: number;
} };

export default function MRecExample() {
  const [show, setShow] = useState(false);
  const adRef = useRef<AdViewRef>(null);

  const onLoaded = useCallback((e?: NativeSyntheticEvent<OnLoadedEvent>) => {
    const { width, height } = e?.nativeEvent ?? {};
    console.log('MREC loaded', { width, height });
  }, []);
  const onFailed = useCallback((e: NativeSyntheticEvent<OnFailedEvent>) => {
    const { code, message } = e.nativeEvent;
    console.log('MREC failed', { code, message });
  }, []);
  const onClicked = useCallback(() => console.log('MREC clicked'), []);
  const onImpression = useCallback(
    (e: NativeSyntheticEvent<OnImpressionEvent>) => console.log('MREC impression', e.nativeEvent.impression),
    []
  );

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>MREC</Text>
        <View style={S.stack}>
          <Button title={show ? 'Hide MREC' : 'Show MREC'} onPress={() => setShow(s => !s)} />
        </View>
      </View>

      {show && (
        <View style={S.dock} pointerEvents="box-none">
          <View style={S.centerRow}>
            <AdView
              ref={adRef}
              size={AdViewSize.MREC}
              refreshInterval={30}
              style={S.mrec}
              onAdViewLoaded={onLoaded}
              onAdViewFailed={onFailed}
              onAdViewClicked={onClicked}
              onAdViewImpression={onImpression}
            />
          </View>
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
  stack: { gap: 12 },
  dock: { position: 'absolute', left: 0, right: 0, bottom: Platform.select({ ios: 36, android: 0 }), paddingVertical: 6 },
  centerRow: { width: '100%', alignItems: 'center' },
  mrec: { alignSelf: 'center' },
});
