import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppButton from '../components/AppButton';
import { AppOpenAd } from 'react-native-cas';

export default function AppOpenExample() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onLoaded = () => setLoading(false);
    const onFailed = () => setLoading(false);
    AppOpenAd.addAdLoadedEventListener(onLoaded);
    AppOpenAd.addAdLoadFailedEventListener(onFailed);
    return () => {
      AppOpenAd.removeAdLoadedEventListener();
      AppOpenAd.removeAdLoadFailedEventListener();
    };
  }, []);

  const onPress = async () => {
    const ready = await AppOpenAd.isAdLoaded();
    if (ready) AppOpenAd.showAd();
    else { setLoading(true); AppOpenAd.loadAd(); }
  };

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>App Open</Text>
        <Text style={S.subtitle}>Load & show on app start</Text>
        <View style={S.stack}>
          <AppButton title={loading ? 'Loading…' : 'Load / Show App Open'} onPress={onPress} enabled={!loading} />
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
});
