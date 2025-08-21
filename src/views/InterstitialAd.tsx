import { CASMobileAds } from '../modules/CASMobileAds';
import type { FullscreenAdType } from '../types/FullscreenAdType';
import { addEventListener, removeEventListener } from '../EventEmitter';

const EVENTS = {
  LOADED: 'onInterstitialLoaded',
  LOAD_FAILED: 'onInterstitialLoadFailed',
  CLICKED: 'onInterstitialClicked',
  DISPLAYED: 'onInterstitialDisplayed',
  FAILED_TO_SHOW: 'onInterstitialFailedToShow',
  HIDDEN: 'onInterstitialHidden',
  IMPRESSION: 'onInterstitialImpression',
};

export const InterstitialAd: FullscreenAdType = {
  isAdLoaded: CASMobileAds.isInterstitialAdLoaded,
  loadAd: CASMobileAds.loadInterstitialAd,
  showAd: CASMobileAds.showInterstitialAd,

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
