import React, { useCallback } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import { CASMobileAds, Audience, PrivacyGeography } from 'react-native-cas';
import { useNavigation } from '@react-navigation/native';

const CAS_IDS = {
  android: 'YOUR_ANDROID_CAS_ID',
  ios: 'YOUR_IOS_CAS_ID',
};

export default function SetupScreen() {
  const nav = useNavigation();

  const init = useCallback(async () => {
    try {
      const casId = Platform.select({ android: CAS_IDS.android, ios: CAS_IDS.ios });
      const status = await CASMobileAds.initialize(casId, {
        forceTestAds: true,
        targetAudience: Audience.NotChildren,
        debugPrivacyGeography: PrivacyGeography.europeanEconomicArea,
        showConsentFormIfRequired: true,
      });
      console.log('CAS initialized:', status);
      nav.navigate('Menu' as never);
    } catch (e) {
      console.warn('CAS init error', e);
    }
  }, [nav]);

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Initialize CAS</Text>
        <Text style={S.subtitle}>One tap to set up SDK & continue</Text>

        <View style={S.stack}>
          <AppButton title="Initialize" onPress={init} />
        </View>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8EEF6',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#A5B3C5',
    textAlign: 'center',
    marginBottom: 16,
  },
  stack: {
    gap: 12,
  },
});
