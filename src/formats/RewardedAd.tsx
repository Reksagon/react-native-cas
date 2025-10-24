import CASMobileAdsNative from '../modules/NativeCASMobileAdsModule';
import type { RewardedAdType } from '../types/FullscreenAds';
import { addAdEventListener } from '../EventEmitter';

export enum RewardedAdEvent {
  LOADED = 'onRewardedLoaded',
  FAILED_TO_LOAD = 'onRewardedFailedToLoad',
  FAILED_TO_SHOW = 'onRewardedFailedToShow',
  SHOWED = 'onRewardedShowed',
  CLICKED = 'onRewardedClicked',
  IMPRESSION = 'onRewardedImpression',
  REWARD = 'onRewardedCompleted',
  DISMISSED = 'onRewardedDismissed',
}

export const RewardedAd: RewardedAdType = {
  isAdLoaded: CASMobileAdsNative.isRewardedAdLoaded,
  loadAd: CASMobileAdsNative.loadRewardedAd,
  showAd: CASMobileAdsNative.showRewardedAd,
  setAutoloadEnabled: CASMobileAdsNative.setRewardedAutoloadEnabled,
  destroy: CASMobileAdsNative.destroyRewarded,

  addAdUserEarnRewardEventListener: l => addAdEventListener(RewardedAdEvent.REWARD, l),
  addAdLoadedEventListener: l => addAdEventListener(RewardedAdEvent.LOADED, l),
  addAdFailedToLoadEventListener: l => addAdEventListener(RewardedAdEvent.FAILED_TO_LOAD, l),
  addAdClickedEventListener: l => addAdEventListener(RewardedAdEvent.CLICKED, l),
  addAdShowedEventListener: l => addAdEventListener(RewardedAdEvent.SHOWED, l),
  addAdFailedToShowEventListener: l => addAdEventListener(RewardedAdEvent.FAILED_TO_SHOW, l),
  addAdDismissedEventListener: l => addAdEventListener(RewardedAdEvent.DISMISSED, l),
  addAdImpressionEventListener: l => addAdEventListener(RewardedAdEvent.IMPRESSION, l),
};
