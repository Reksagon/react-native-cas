import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useCasContext } from './cas.context';
import { InterstitialAd, RewardedAd, AppOpenAd } from 'react-native-cas';

type BusyKind = null | 'Interstitial' | 'Rewarded' | 'AppOpen';


const pickError = (e: any): { code?: number; message?: string } | undefined => {
  const p = (e && e.nativeEvent) ? e.nativeEvent : e;
  if (!p) return undefined;
  if (p.error) return p.error;                         
  if ('code' in p || 'message' in p) return p;         
  if ('errorCode' in p || 'errorMessage' in p)          
    return { code: p.errorCode, message: p.errorMessage };
  return undefined;
};


export const Ads = () => {
  const { logCasInfo } = useCasContext();
  const [busy, setBusy] = useState<BusyKind>(null);

  useEffect(() => {
    // Interstitial
    InterstitialAd.addAdLoadedEventListener(() => logCasInfo('Interstitial loaded'));
    InterstitialAd.addAdLoadFailedEventListener((e) => {
      const err = pickError(e);
      logCasInfo('Interstitial failed to load', err ? `${err.code}: ${err.message}` : '(no error payload)');
    });
    InterstitialAd.addAdShowedEventListener(() => logCasInfo('Interstitial showed'));
    InterstitialAd.addAdFailedToShowEventListener((e) => {
      const err = pickError(e);
      logCasInfo('Interstitial failed to show', err ? `${err.code}: ${err.message}` : '(no error payload)');
    });
    InterstitialAd.addAdClickedEventListener(() => logCasInfo('Interstitial clicked'));
    InterstitialAd.addAdDismissedEventListener(() => logCasInfo('Interstitial closed'));

    // Rewarded
    RewardedAd.addAdLoadedEventListener(() => logCasInfo('Rewarded loaded'));
    RewardedAd.addAdLoadFailedEventListener((e) => {
      const err = pickError(e);
      logCasInfo('Rewarded failed to load', err ? `${err.code}: ${err.message}` : '(no error payload)');
    });
    RewardedAd.addAdShowedEventListener(() => logCasInfo('Rewarded showed'));
    RewardedAd.addAdFailedToShowEventListener((e) => {
      const err = pickError(e);
      logCasInfo('Rewarded failed to show', err ? `${err.code}: ${err.message}` : '(no error payload)');
    });
    RewardedAd.addAdClickedEventListener(() => logCasInfo('Rewarded clicked'));
    RewardedAd.addAdDismissedEventListener(() => logCasInfo('Rewarded closed'));
    RewardedAd.addAdUserEarnRewardEventListener(() => logCasInfo('Rewarded completed'));

    // AppOpen
    AppOpenAd.addAdLoadedEventListener(() => logCasInfo('AppOpen loaded'));
    AppOpenAd.addAdLoadFailedEventListener((e) => {
      const err = pickError(e);
      logCasInfo('AppOpen failed to load', err ? `${err.code}: ${err.message}` : '(no error payload)');
    });
    AppOpenAd.addAdShowedEventListener(() => logCasInfo('AppOpen showed'));
    AppOpenAd.addAdFailedToShowEventListener((e) => {
      const err = pickError(e);
      logCasInfo('AppOpen failed to show', err ? `${err.code}: ${err.message}` : '(no error payload)');
    });
    AppOpenAd.addAdClickedEventListener(() => logCasInfo('AppOpen clicked'));
    AppOpenAd.addAdDismissedEventListener(() => logCasInfo('AppOpen closed'));
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
    () => showWithLoader('Interstitial', {
      isLoaded: InterstitialAd.isAdLoaded,
      load: () => InterstitialAd.loadAd(),
      show: () => InterstitialAd.showAd(),
    }),
    [showWithLoader]
  );

  const showRewarded = useCallback(
    () => showWithLoader('Rewarded', {
      isLoaded: RewardedAd.isAdLoaded,
      load: () => RewardedAd.loadAd(),
      show: () => RewardedAd.showAd(),
    }),
    [showWithLoader]
  );

  const showAppOpenedAd = useCallback(
    () => showWithLoader('AppOpen', {
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
