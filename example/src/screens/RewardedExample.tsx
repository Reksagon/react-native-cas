import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import { RewardedAd, type AdError, type AdContentInfo } from 'react-native-cas';

const MAX_RETRY = 6 as const;

export default function RewardedExample() {
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle');
  const retry = useRef(0);

  useEffect(() => {
    const offLoaded = RewardedAd.addAdLoadedEventListener(() => {
      console.log('[Rewarded] LOADED');
      setState('ready'); retry.current = 0;
    });

    const offLoadFailed = RewardedAd.addAdLoadFailedEventListener((e: AdError) => {
      console.log('[Rewarded] LOAD_FAILED', e);
      setState('idle');
      if (retry.current >= MAX_RETRY) return;
      retry.current += 1;
      const delay = Math.min(64, 2 ** retry.current);
      setTimeout(() => { setState('loading'); RewardedAd.loadAd(); }, delay * 1000);
    });

    const offClicked = RewardedAd.addAdClickedEventListener(() => console.log('[Rewarded] CLICKED'));
    const offDisplayed = RewardedAd.addAdShowedEventListener(() => console.log('[Rewarded] DISPLAYED'));
    const offFailShow = RewardedAd.addAdFailedToShowEventListener((e: AdError) => console.log('[Rewarded] FAILED_TO_SHOW', e));
    const offHidden = RewardedAd.addAdDismissedEventListener(() => { console.log('[Rewarded] HIDDEN'); setState('idle'); });
    const offImpression = RewardedAd.addAdImpressionEventListener((info: AdContentInfo) => console.log('[Rewarded] IMPRESSION', info));
    const offEarned = RewardedAd.addAdUserEarnRewardEventListener(() => {
      console.log('[Rewarded] EARNED_REWARD');
    });

    return () => {
      offLoaded();
      offLoadFailed();
      offClicked();
      offDisplayed();
      offFailShow();
      offHidden();
      offImpression();
      offEarned();
    };
  }, []);

  const onPress = async () => {
    if (await RewardedAd.isAdLoaded()) RewardedAd.showAd();
    else { setState('loading'); RewardedAd.loadAd(); }
  };

  const title = state === 'ready' ? 'Show Rewarded' : state === 'loading' ? 'Loading…' : 'Load Rewarded';

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Rewarded</Text>
        <Text style={S.subtitle}>Get a reward on completion</Text>
        <View style={S.stack}>
          <AppButton title={title} onPress={onPress} enabled={state !== 'loading'} />
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
