import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppButton from '../components/AppButton';
import { RewardedAd, type AdError, type AdContentInfo } from 'react-native-cas';

const isAutoloadEnabled = true as const; 

export default function RewardedExample() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const retry = useRef(0);

  useEffect(() => {
    (RewardedAd as any).setAutoloadEnabled?.(isAutoloadEnabled);

    const onLoaded = () => {
      console.log('[Rewarded] LOADED');
      setLoaded(true);
      setLoading(false);
      retry.current = 0;
    };

    const onLoadFailed = (e: AdError) => {
      console.log('[Rewarded] LOAD_FAILED', e);
      setLoaded(false);
      if (isAutoloadEnabled) {
        setLoading(true);
      } else {
        setLoading(false);
        retry.current = Math.min(retry.current + 1, 6);
        const delay = Math.min(64, 2 ** retry.current);
        setTimeout(() => RewardedAd.loadAd(), delay * 1000);
      }
    };

    const offLoaded = RewardedAd.addAdLoadedEventListener(onLoaded);
    const offLoadFailed = RewardedAd.addAdLoadFailedEventListener(onLoadFailed);
    const offClicked = RewardedAd.addAdClickedEventListener(() => console.log('[Rewarded] CLICKED'));
    const offDisplayed = RewardedAd.addAdShowedEventListener(() => console.log('[Rewarded] SHOWED'));
    const offFailShow = RewardedAd.addAdFailedToShowEventListener((e: AdError) => {
      console.log('[Rewarded] FAILED_TO_SHOW', e);
      if (isAutoloadEnabled) setLoading(true);
      else RewardedAd.loadAd();
    });
    const offHidden      = RewardedAd.addAdDismissedEventListener(() => {
      console.log('[Rewarded] DISMISSED');
      setLoaded(false);
      if (isAutoloadEnabled) setLoading(true);
    });
    const offImpression = RewardedAd.addAdImpressionEventListener((i: AdContentInfo) => console.log('[Rewarded] IMPRESSION', i));
    const offEarned = RewardedAd.addAdUserEarnRewardEventListener(() => console.log('[Rewarded] EARNED_REWARD'));

    setLoading(true);
    RewardedAd.loadAd();

    return () => {
      offLoaded(); offLoadFailed(); offClicked(); offDisplayed();
      offFailShow(); offHidden(); offImpression(); offEarned();
    };
  }, []);

  const onLoad = () => {
    if (isAutoloadEnabled || loading || loaded) return; 
    setLoading(true);
    RewardedAd.loadAd();
  };

  const onShow = async () => {
    if (await RewardedAd.isAdLoaded()) {
      setLoaded(false);
      if (isAutoloadEnabled) setLoading(true); 
      RewardedAd.showAd();
    }
  };


  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Rewarded</Text>

        <View style={S.row}>
          <AppButton
            title={loading ? (isAutoloadEnabled ? 'Auto…' : 'Loading…') : 'Load'}
            onPress={onLoad}
            enabled={!isAutoloadEnabled && !loaded && !loading}
          />
          <AppButton title="Show" onPress={onShow} enabled={loaded} />
        </View>

        <View style={S.status}>
          {loading && <ActivityIndicator />}
        </View>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, backgroundColor: '#0B0F14', alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#121821', padding: 20, elevation: 6 },
  title: { fontSize: 20, fontWeight: '700', color: '#E8EEF6', textAlign: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  status: { marginTop: 12, alignItems: 'center', gap: 8 },
  state: { color: '#A5B3C5' },
});
