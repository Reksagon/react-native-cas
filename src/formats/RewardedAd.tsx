import { CASMobileAds } from '../modules/CASMobileAds';
import type { FullscreenAdType } from '../types/FullscreenAdType';
import { addEventListener, removeEventListener } from '../EventEmitter';

const EVENTS = {
  LOADED: 'onRewardedLoaded',
  LOAD_FAILED: 'onRewardedLoadFailed',
  CLICKED: 'onRewardedClicked',
  DISPLAYED: 'onRewardedDisplayed',
  FAILED_TO_SHOW: 'onRewardedFailedToShow',
  HIDDEN: 'onRewardedHidden',
  REWARDED: 'onRewardedCompleted',
  IMPRESSION: 'onRewardedImpression',
};

export const RewardedAd: FullscreenAdType = {
  isAdLoaded: CASMobileAds.isRewardedAdLoaded,
  loadAd: CASMobileAds.loadRewardedAd,
  showAd: CASMobileAds.showRewardedAd,

  setAutoloadEnabled: CASMobileAds.setRewardedAutoloadEnabled,
  destroy: CASMobileAds.destroyRewarded,

  addAdUserEarnRewardEventListener: (l) => addEventListener(EVENTS.REWARDED, l),
  removeAdUserEarnRewardLoadedEventListener: () => removeEventListener(EVENTS.REWARDED),

  addAdLoadedEventListener: (l) => addEventListener(EVENTS.LOADED, l),
  removeAdLoadedEventListener: () => removeEventListener(EVENTS.LOADED),

  addAdLoadFailedEventListener: (l) => addEventListener(EVENTS.LOAD_FAILED, l),
  removeAdLoadFailedEventListener: () => removeEventListener(EVENTS.LOAD_FAILED),

  addAdClickedEventListener: (l) => addEventListener(EVENTS.CLICKED, l),
  removeAdClickedEventListener: () => removeEventListener(EVENTS.CLICKED),

  addAdShowedEventListener: (l) => addEventListener(EVENTS.DISPLAYED, l),
  removeAdShowedEventListener: () => removeEventListener(EVENTS.DISPLAYED),

  addAdFailedToShowEventListener: (l) => addEventListener(EVENTS.FAILED_TO_SHOW, l),
  removeAdFailedToShowEventListener: () => removeEventListener(EVENTS.FAILED_TO_SHOW),

  addAdDismissedEventListener: (l) => addEventListener(EVENTS.HIDDEN, l),
  removeAdDismissedEventListener: () => removeEventListener(EVENTS.HIDDEN),

  addAdImpressionEventListener: (l) => addEventListener(EVENTS.IMPRESSION, l),
  removeAdImpressionEventListener: () => removeEventListener(EVENTS.IMPRESSION),
} as unknown as FullscreenAdType;
