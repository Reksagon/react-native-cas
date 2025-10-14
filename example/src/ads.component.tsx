import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useCasContext } from './cas.context';
import {
  InterstitialAd,
  RewardedAd,
  AppOpenAd,
  type AdError,
  type AdContentInfo,
} from 'react-native-cas';

type BusyKind = null | 'Interstitial' | 'Rewarded' | 'AppOpen';

const fmtImpression = (i: AdContentInfo) => {
  const parts = [
    `fmt=${i.format}`,
    `rev=${i.revenue}${i.revenuePrecision ? `(${i.revenuePrecision})` : ''}`,
    `total=${i.revenueTotal}`,
    `depth=${i.impressionDepth}`,
    `src=${i.sourceName}`,
    `unit=${i.sourceUnitId}`,
    i.creativeId ? `creative=${i.creativeId}` : null,
  ].filter(Boolean);
  return parts.join(' ');
};

export const Ads = () => {
  const { logCasInfo } = useCasContext();
  const [busy, setBusy] = useState<BusyKind>(null);

  const logErr = (title: string) => (e: AdError) =>
  {
    logCasInfo(title, `${e.code}: ${e.message}`);
    setBusy(null)
  }

  const logImp = (title: string) => (i: AdContentInfo) =>
    logCasInfo(title, fmtImpression(i));

  useEffect(() => {
    // Interstitial
    InterstitialAd.addAdLoadedEventListener(() =>
      logCasInfo('Interstitial loaded')
    );
    InterstitialAd.addAdLoadFailedEventListener(
      logErr('Interstitial failed to load')
    
    );
    InterstitialAd.addAdShowedEventListener(() =>
      logCasInfo('Interstitial showed')
    );
    InterstitialAd.addAdFailedToShowEventListener(
      logErr('Interstitial failed to show')
    );
    InterstitialAd.addAdClickedEventListener(() =>
      logCasInfo('Interstitial clicked')
    );
    InterstitialAd.addAdDismissedEventListener(() =>
      logCasInfo('Interstitial closed')
    );
    InterstitialAd.addAdImpressionEventListener(
      logImp('Interstitial impression')
    );

    // Rewarded
    RewardedAd.addAdLoadedEventListener(() =>
      logCasInfo('Rewarded loaded')
    );
    RewardedAd.addAdLoadFailedEventListener(
      logErr('Rewarded failed to load')
    );
    RewardedAd.addAdShowedEventListener(() =>
      logCasInfo('Rewarded showed')
    );
    RewardedAd.addAdFailedToShowEventListener(
      logErr('Rewarded failed to show')
    );
    RewardedAd.addAdClickedEventListener(() =>
      logCasInfo('Rewarded clicked')
    );
    RewardedAd.addAdDismissedEventListener(() =>
      logCasInfo('Rewarded closed')
    );
    RewardedAd.addAdUserEarnRewardEventListener(() =>
      logCasInfo('Rewarded completed')
    );
    RewardedAd.addAdImpressionEventListener(
      logImp('Rewarded impression')
    );

    // App Open
    AppOpenAd.addAdLoadedEventListener(() =>
      logCasInfo('AppOpen loaded')
    );
    AppOpenAd.addAdLoadFailedEventListener(
      logErr('AppOpen failed to load')
    );
    AppOpenAd.addAdShowedEventListener(() =>
      logCasInfo('AppOpen showed')
    );
    AppOpenAd.addAdFailedToShowEventListener(
      logErr('AppOpen failed to show')
    );
    AppOpenAd.addAdClickedEventListener(() =>
      logCasInfo('AppOpen clicked')
    );
    AppOpenAd.addAdDismissedEventListener(() =>
      logCasInfo('AppOpen closed')
    );
    AppOpenAd.addAdImpressionEventListener(
      logImp('AppOpen impression')
    );

    return () => {
      InterstitialAd.removeAdLoadedEventListener();
      InterstitialAd.removeAdLoadFailedEventListener();
      InterstitialAd.removeAdShowedEventListener();
      InterstitialAd.removeAdFailedToShowEventListener();
      InterstitialAd.removeAdClickedEventListener();
      InterstitialAd.removeAdDismissedEventListener();
      InterstitialAd.removeAdImpressionEventListener();

      RewardedAd.removeAdLoadedEventListener();
      RewardedAd.removeAdLoadFailedEventListener();
      RewardedAd.removeAdShowedEventListener();
      RewardedAd.removeAdFailedToShowEventListener();
      RewardedAd.removeAdClickedEventListener();
      RewardedAd.removeAdDismissedEventListener();
      RewardedAd.removeAdImpressionEventListener();
      RewardedAd.removeAdUserEarnRewardLoadedEventListener?.();

      AppOpenAd.removeAdLoadedEventListener();
      AppOpenAd.removeAdLoadFailedEventListener();
      AppOpenAd.removeAdShowedEventListener();
      AppOpenAd.removeAdFailedToShowEventListener();
      AppOpenAd.removeAdClickedEventListener();
      AppOpenAd.removeAdDismissedEventListener();
      AppOpenAd.removeAdImpressionEventListener();
    };
  }, [logCasInfo]);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const showWithLoader = useCallback(
    async (
      kind: Exclude<BusyKind, null>,
      opts: {
        isLoaded: () => Promise<boolean>;
        load: () => void;
        show: () => void;
      }
    ) => {
      // if (busy) return;
      // setBusy(kind);
      try {
        opts.load();
        for (;;) {
          if (await opts.isLoaded()) {
            opts.show();
            break;
          }
          await delay(750);
        }
      } finally {
        // setBusy(null);
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
