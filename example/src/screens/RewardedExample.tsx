import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import { RewardedAd, type AdError, type AdContentInfo } from 'react-native-cas';

const isAutoloadEnabled = true as const;

export default function RewardedExample() {
  const [loaded, setLoaded] = useState(false);
  const retry = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (RewardedAd as any).setAutoloadEnabled?.(isAutoloadEnabled);

    const offLoaded = RewardedAd.addAdLoadedEventListener(() => {
      console.log('[Rewarded] LOADED');
      setLoaded(true);
      retry.current = 0;
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    });

    const offLoadFailed = RewardedAd.addAdLoadFailedEventListener((e: AdError) => {
      console.log('[Rewarded] LOAD_FAILED', e);
      setLoaded(false);
      if (isAutoloadEnabled) {
        // just wait auto reload
      } else {
        retry.current = Math.min(retry.current + 1, 6);
        const delay = Math.min(64, 2 ** retry.current);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => { timerRef.current = null; RewardedAd.loadAd(); }, delay * 1000);
      }
    });

    const offClicked = RewardedAd.addAdClickedEventListener(() => console.log('[Rewarded] CLICKED'));
    const offDisplayed = RewardedAd.addAdShowedEventListener(() => console.log('[Rewarded] SHOWED'));
    const offFailShow = RewardedAd.addAdFailedToShowEventListener((e: AdError) => {
      console.log('[Rewarded] FAILED_TO_SHOW', e);
      setLoaded(false);
      if (isAutoloadEnabled) {
        // just wait auto reload
      } else {
        RewardedAd.loadAd();
      }
    });
    const offHidden = RewardedAd.addAdDismissedEventListener(() => {
      console.log('[Rewarded] DISMISSED');
      setLoaded(false);
      if (isAutoloadEnabled) {
        // just wait auto reload
      } else {
        RewardedAd.loadAd(); 
      }
    });
    const offImpression = RewardedAd.addAdImpressionEventListener((i: AdContentInfo) => console.log('[Rewarded] IMPRESSION', i));
    const offEarned = RewardedAd.addAdUserEarnRewardEventListener(() => console.log('[Rewarded] EARNED_REWARD'));

    RewardedAd.loadAd();

    return () => {
      offLoaded(); offLoadFailed(); offClicked(); offDisplayed(); offFailShow(); offHidden(); offImpression(); offEarned();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onLoad = () => RewardedAd.loadAd();

  const onShow = async () => {
    if (await RewardedAd.isAdLoaded()) {
      setLoaded(false);
      RewardedAd.showAd();
    }
  };

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Rewarded</Text>
        <View style={S.row}>
          <AppButton title="Load" onPress={onLoad} />
          <AppButton title="Show" onPress={onShow} enabled={loaded} />
        </View>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, backgroundColor: '#0B0F14', alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#121821', padding: 20, elevation: 6 },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 8 },
});
