import { CASMobileAds } from '../modules/CASMobileAds';
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
  removeAdUserEarnRewardLoadedEventListener: () => removeEventListener(E.COMPLETED),

  addAdLoadedEventListener: (l) => addEventListener(E.LOADED, l),
  removeAdLoadedEventListener: () => removeEventListener(E.LOADED),

  addAdLoadFailedEventListener: (l) => addEventListener(E.LOAD_FAILED, l),
  removeAdLoadFailedEventListener: () => removeEventListener(E.LOAD_FAILED),

  addAdClickedEventListener: (l) => addEventListener(E.CLICKED, l),
  removeAdClickedEventListener: () => removeEventListener(E.CLICKED),

  addAdShowedEventListener: (l) => addEventListener(E.DISPLAYED, l),
  removeAdShowedEventListener: () => removeEventListener(E.DISPLAYED),

  addAdFailedToShowEventListener: (l) => addEventListener(E.FAILED_TO_SHOW, l),
  removeAdFailedToShowEventListener: () => removeEventListener(E.FAILED_TO_SHOW),

  addAdDismissedEventListener: (l) => addEventListener(E.HIDDEN, l),
  removeAdDismissedEventListener: () => removeEventListener(E.HIDDEN),

  addAdImpressionEventListener: (l) => addEventListener(E.IMPRESSION, l),
  removeAdImpressionEventListener: () => removeEventListener(E.IMPRESSION),
};
