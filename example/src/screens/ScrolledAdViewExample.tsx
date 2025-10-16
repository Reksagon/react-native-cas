import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import { AdView, AdViewSize } from 'react-native-cas';

const REPEATS = 2;
const TXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit…`;

export default function ScrolledAdViewExample() {
  const [showAds, setShowAds] = useState(true);

  const block = (key: string, node: JSX.Element) => (
    <View key={key} style={{ marginBottom: 12 }}>
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
            block(`b-${i}`, <AdView size={AdViewSize.BANNER} />),
            block(`m-${i}`, <AdView size={AdViewSize.MREC} />),
          ])}
        </ScrollView>

        <View style={{ marginTop: 12, alignItems: 'center' }}>
          {showAds ? <AdView size={AdViewSize.BANNER} /> : <Text style={S.placeholder}>Placeholder</Text>}
        </View>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, backgroundColor: '#0B0F14', alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#121821', padding: 20, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#A5B3C5', textAlign: 'center', marginBottom: 16 },
  stack: { gap: 12 },
  p: { margin: 8, fontSize: 16, color: '#E8EEF6' },
  placeholder: {
    marginTop: 10, backgroundColor: '#223044', color: '#E8EEF6',
    fontSize: 16, textAlign: 'center', height: 50, textAlignVertical: 'center' as const,
    borderRadius: 8,
  },
});
