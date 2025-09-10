import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

import {
  InterstitialAd,
  RewardedAd,
  AppOpenAd,
} from 'react-native-cas';

type BusyKind = null | 'Interstitial' | 'Rewarded' | 'AppOpen';

export const Ads = () => {
  const [busy, setBusy] = useState<BusyKind>(null);

  useEffect(() => {
    InterstitialAd.addAdLoadedEventListener(() => console.log('Interstitial loaded'));
    InterstitialAd.addAdLoadFailedEventListener((e) => console.log('Interstitial load failed:', e));
    InterstitialAd.addAdDisplayedEventListener(() => console.log('Interstitial displayed'));
    InterstitialAd.addAdFailedToShowEventListener((e) => console.log('Interstitial failed to show:', e));
    InterstitialAd.addAdClickedEventListener(() => console.log('Interstitial clicked'));
    InterstitialAd.addAdDismissedEventListener(() => console.log('Interstitial closed'));
    InterstitialAd.addAdImpressionEventListener((info) => console.log('Interstitial impression:', info));

    RewardedAd.addAdLoadedEventListener(() => console.log('Rewarded loaded'));
    RewardedAd.addAdLoadFailedEventListener((e) => console.log('Rewarded load failed:', e));
    RewardedAd.addAdDisplayedEventListener(() => console.log('Rewarded displayed'));
    RewardedAd.addAdFailedToShowEventListener((e) => console.log('Rewarded failed to show:', e));
    RewardedAd.addAdClickedEventListener(() => console.log('Rewarded clicked'));
    RewardedAd.addAdDismissedEventListener(() => console.log('Rewarded closed'));
    RewardedAd.addAdImpressionEventListener((info) => console.log('Rewarded impression:', info));

    AppOpenAd.addAdLoadedEventListener(() => console.log('AppOpen loaded'));
    AppOpenAd.addAdLoadFailedEventListener((e) => console.log('AppOpen load failed:', e));
    AppOpenAd.addAdDisplayedEventListener(() => console.log('AppOpen displayed'));
    AppOpenAd.addAdFailedToShowEventListener((e) => console.log('AppOpen failed to show:', e));
    AppOpenAd.addAdClickedEventListener(() => console.log('AppOpen clicked'));
    AppOpenAd.addAdDismissedEventListener(() => console.log('AppOpen closed'));
    AppOpenAd.addAdImpressionEventListener((info) => console.log('AppOpen impression:', info));
  }, []);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const showWithLoader = useCallback(
    async (
      kind: Exclude<BusyKind, null>,
      opts: {
        isLoaded: () => Promise<boolean>;
        load: () => Promise<void>;
        show: () => Promise<void>;
      }
    ) => {
      if (busy) return;
      setBusy(kind);
      try {
        await opts.load();
        for (;;) {
          if (await opts.isLoaded()) {
            await opts.show();
            break;
          }
          await delay(750);
        }
      } finally {
        setBusy(null);
      }
    },
    [busy]
  );

  const showInterstitial = useCallback(
    () =>
      showWithLoader('Interstitial', {
        isLoaded: InterstitialAd.isAdLoaded,
        load: () => InterstitialAd.loadAd(),
        show: () => InterstitialAd.showAd(),
      }),
    [showWithLoader]
  );

  const showRewarded = useCallback(
    () =>
      showWithLoader('Rewarded', {
        isLoaded: RewardedAd.isAdLoaded,
        load: () => RewardedAd.loadAd(),
        show: () => RewardedAd.showAd(),
      }),
    [showWithLoader]
  );

  const showAppOpenedAd = useCallback(
    () =>
      showWithLoader('AppOpen', {
        isLoaded: AppOpenAd.isAdLoaded,
        load: () => AppOpenAd.loadAd(),
        show: () => AppOpenAd.showAd(),
      }),
    [showWithLoader]
  );

  const disabled = !!busy;

  return (
    <SafeAreaView style={styles.screen}>
      <Button title="Show interstitial" onPress={showInterstitial} disabled={disabled} />
      <Button title="Show rewarded" onPress={showRewarded} disabled={disabled} />
      <View style={{ height: 16 }} />
      <Button title="Show app opened" onPress={showAppOpenedAd} disabled={disabled} />

      <Modal visible={!!busy} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: '#0006', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ color: 'white', marginTop: 12 }}>
            {busy === 'Interstitial' && 'Loading interstitial...'}
            {busy === 'Rewarded' && 'Loading rewarded...'}
            {busy === 'AppOpen' && 'Loading app open ad...'}
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
