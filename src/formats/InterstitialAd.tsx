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

  setAutoloadEnabled: CASMobileAds.setInterstitialAutoloadEnabled,
  setAutoshowEnabled: CASMobileAds.setInterstitialAutoshowEnabled,
  setMinInterval: CASMobileAds.setInterstitialMinInterval,
  restartInterval: CASMobileAds.restartInterstitialInterval,
  destroy: CASMobileAds.destroyInterstitial,

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
};
