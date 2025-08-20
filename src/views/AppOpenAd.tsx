import { CASMobileAds } from '../modules/CASMobileAds';
import type { FullscreenAdType } from '../types/FullscreenAdType';
import { addEventListener, removeEventListener } from '../EventEmitter';

const EVENTS = {
  LOADED: 'onAppOpenLoaded',
  LOAD_FAILED: 'onAppOpenLoadFailed',
  CLICKED: 'onAppOpenClicked',
  DISPLAYED: 'onAppOpenDisplayed',
  FAILED_TO_SHOW: 'onAppOpenFailedToShow',
  HIDDEN: 'onAppOpenHidden',
  IMPRESSION: 'onAppOpenImpression',
};

export const AppOpenAd: FullscreenAdType = {
  isAdReady: CASMobileAds.isRewardedReady,
  loadAd: CASMobileAds.loadRewarded,
  showAd: CASMobileAds.showRewarded,

  addAdLoadedEventListener: (listener) => addEventListener(EVENTS.LOADED, listener),
  removeAdLoadedEventListener: () => removeEventListener(EVENTS.LOADED),

  addAdLoadFailedEventListener: (listener) => addEventListener(EVENTS.LOAD_FAILED, listener),
  removeAdLoadFailedEventListener: () => removeEventListener(EVENTS.LOAD_FAILED),

  addAdClickedEventListener: (listener) => addEventListener(EVENTS.CLICKED, listener),
  removeAdClickedEventListener: () => removeEventListener(EVENTS.CLICKED),

  addAdDisplayedEventListener: (listener) => addEventListener(EVENTS.DISPLAYED, listener),
  removeAdDisplayedEventListener: () => removeEventListener(EVENTS.DISPLAYED),

  addAdFailedToShowEventListener: (listener) => addEventListener(EVENTS.FAILED_TO_SHOW, listener),
  removeAdFailedToShowEventListener: () => removeEventListener(EVENTS.FAILED_TO_SHOW),

  addAdDismissedEventListener: (listener) => addEventListener(EVENTS.HIDDEN, listener),
  removeAdDismissedEventListener: () => removeEventListener(EVENTS.HIDDEN),

  addAdImpressionEventListener: (listener) => addEventListener(EVENTS.IMPRESSION, listener),
  removeAdImpressionEventListener: () => removeEventListener(EVENTS.IMPRESSION),
};
