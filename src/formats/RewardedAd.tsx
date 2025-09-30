import { CASMobileAds } from '../modules/CASMobileAds';
import type { RewardedAdType } from '../types/FullscreenAdType';
import { addEventListener } from '../EventEmitter';

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
  removeAdUserEarnRewardLoadedEventListener: () => {},

  addAdLoadedEventListener: (l) => addEventListener(E.LOADED, l),
  removeAdLoadedEventListener: () => {},

  addAdLoadFailedEventListener: (l) => addEventListener(E.LOAD_FAILED, l),
  removeAdLoadFailedEventListener: () => {},

  addAdClickedEventListener: (l) => addEventListener(E.CLICKED, l),
  removeAdClickedEventListener: () => {},

  addAdShowedEventListener: (l) => addEventListener(E.DISPLAYED, l),
  removeAdShowedEventListener: () => {},

  addAdFailedToShowEventListener: (l) => addEventListener(E.FAILED_TO_SHOW, l),
  removeAdFailedToShowEventListener: () => {},

  addAdDismissedEventListener: (l) => addEventListener(E.HIDDEN, l),
  removeAdDismissedEventListener: () => {},

  addAdImpressionEventListener: (l) => addEventListener(E.IMPRESSION, l),
  removeAdImpressionEventListener: () => {},
};
