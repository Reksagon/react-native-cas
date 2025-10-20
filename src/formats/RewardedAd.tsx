import { CASMobileAds } from '../CASMobileAds';
import type { RewardedAdType } from '../types/FullscreenAdType';
import { addEventListener, removeEventListener } from '../EventEmitter';

const E = {
  LOADED: 'onRewardedLoaded',
  LOAD_FAILED: 'onRewardedLoadFailed',
  CLICKED: 'onRewardedClicked',
  DISPLAYED: 'onRewardedDisplayed',
  FAILED_TO_SHOW: 'onRewardedFailedToShow',
  HIDDEN: 'onRewardedHidden',
  COMPLETED: 'onRewardedCompleted',
  IMPRESSION: 'onRewardedImpression',
};

export const RewardedAd: RewardedAdType = {
  isAdLoaded: CASMobileAds.isRewardedAdLoaded,
  loadAd: CASMobileAds.loadRewardedAd,
  showAd: CASMobileAds.showRewardedAd,
  setAutoloadEnabled: CASMobileAds.setRewardedAutoloadEnabled,
  destroy: CASMobileAds.destroyRewarded,

  addAdUserEarnRewardEventListener: (l) => addEventListener(E.COMPLETED, l),
  addAdLoadedEventListener: (l) => addEventListener(E.LOADED, l),
  addAdLoadFailedEventListener: (l) => addEventListener(E.LOAD_FAILED, l),
  addAdClickedEventListener: (l) => addEventListener(E.CLICKED, l),
  addAdShowedEventListener: (l) => addEventListener(E.DISPLAYED, l),
  addAdFailedToShowEventListener: (l) => addEventListener(E.FAILED_TO_SHOW, l),
  addAdDismissedEventListener: (l) => addEventListener(E.HIDDEN, l),
  addAdImpressionEventListener: (l) => addEventListener(E.IMPRESSION, l),

  removeAdUserEarnRewardLoadedEventListener: () => removeEventListener(E.COMPLETED),
  removeAdLoadedEventListener: () => removeEventListener(E.LOADED),
  removeAdLoadFailedEventListener: () => removeEventListener(E.LOAD_FAILED),
  removeAdClickedEventListener: () => removeEventListener(E.CLICKED),
  removeAdShowedEventListener: () => removeEventListener(E.DISPLAYED),
  removeAdFailedToShowEventListener: () => removeEventListener(E.FAILED_TO_SHOW),
  removeAdDismissedEventListener: () => removeEventListener(E.HIDDEN),
  removeAdImpressionEventListener: () => removeEventListener(E.IMPRESSION),
};
