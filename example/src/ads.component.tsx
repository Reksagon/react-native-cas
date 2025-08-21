import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { InterstitialAd, RewardedAd, AppOpenAd, CASMobileAds } from 'react-native-cas';
import { useCasContext } from './cas.context';

type BusyKind = null | 'Interstitial' | 'Rewarded' | 'AppOpen';

export const Ads = () => {
  const { logCasInfo } = useCasContext();
  const [busy, setBusy] = useState<BusyKind>(null);

  useEffect(() => {
    InterstitialAd.addAdLoadedEventListener(() => logCasInfo('Interstitial loaded'));
    InterstitialAd.addAdLoadFailedEventListener((e) => logCasInfo('Interstitial load failed:', e));
    InterstitialAd.addAdDisplayedEventListener(() => logCasInfo('Interstitial displayed'));
    InterstitialAd.addAdFailedToShowEventListener((e) => logCasInfo('Interstitial failed to show:', e));
    InterstitialAd.addAdClickedEventListener(() => logCasInfo('Interstitial clicked'));
    InterstitialAd.addAdDismissedEventListener(() => logCasInfo('Interstitial closed'));
    InterstitialAd.addAdImpressionEventListener((info) => logCasInfo('Interstitial impression:', info));

    RewardedAd.addAdLoadedEventListener(() => logCasInfo('Rewarded loaded'));
    RewardedAd.addAdLoadFailedEventListener((e) => logCasInfo('Rewarded load failed:', e));
    RewardedAd.addAdDisplayedEventListener(() => logCasInfo('Rewarded displayed'));
    RewardedAd.addAdFailedToShowEventListener((e) => logCasInfo('Rewarded failed to show:', e));
    RewardedAd.addAdClickedEventListener(() => logCasInfo('Rewarded clicked'));
    RewardedAd.addAdDismissedEventListener(() => logCasInfo('Rewarded closed'));
    RewardedAd.addAdImpressionEventListener((info) => logCasInfo('Rewarded impression:', info));

    AppOpenAd.addAdLoadedEventListener(() => logCasInfo('AppOpen loaded'));
    AppOpenAd.addAdLoadFailedEventListener((e) => logCasInfo('AppOpen load failed:', e));
    AppOpenAd.addAdDisplayedEventListener(() => logCasInfo('AppOpen displayed'));
    AppOpenAd.addAdFailedToShowEventListener((e) => logCasInfo('AppOpen failed to show:', e));
    AppOpenAd.addAdClickedEventListener(() => logCasInfo('AppOpen clicked'));
    AppOpenAd.addAdDismissedEventListener(() => logCasInfo('AppOpen closed'));
    AppOpenAd.addAdImpressionEventListener((info) => logCasInfo('AppOpen impression:', info));
  }, [logCasInfo]);

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
          const ok = await opts.isLoaded();
          logCasInfo(kind, 'isLoaded =', ok);
          if (ok) {
            await opts.show();
            break;
          }
          await delay(750);
        }
      } catch (e) {
        logCasInfo(`${kind} flow error:`, String((e as any)?.message ?? e));
      } finally {
        setBusy(null);
      }
    },
    [busy, logCasInfo]
  );

  const setLastPageContent = useCallback(async () => {
    try {
      const params = {
        headline: 'Headline',
        adText: 'Ad text',
        destinationURL: 'https://www.google.com',
      };
      await (CASMobileAds as any).setLastPageAdContent?.(params);
      logCasInfo('Last page content set:', params);
    } catch (e: any) {
      logCasInfo('setLastPageAdContent error:', String(e?.message ?? e));
    }
  }, [logCasInfo]);

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
        load: () => AppOpenAd.loadAd(true as any),
        show: () => AppOpenAd.showAd(),
      }),
    [showWithLoader]
  );

  const disabled = !!busy;

  return (
    <SafeAreaView style={styles.screen}>
      <Button title="Set last page content" onPress={setLastPageContent} disabled={disabled} />
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
