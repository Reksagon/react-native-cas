import { CASMobileAds } from '../CASMobileAds';
import type { InterstitialAdType } from '../types/FullscreenAdType';
import { addEventListener, removeEventListener } from '../EventEmitter';

const E = {
  LOADED: 'onInterstitialLoaded',
  LOAD_FAILED: 'onInterstitialLoadFailed',
  CLICKED: 'onInterstitialClicked',
  DISPLAYED: 'onInterstitialDisplayed',
  FAILED_TO_SHOW: 'onInterstitialFailedToShow',
  HIDDEN: 'onInterstitialHidden',
  IMPRESSION: 'onInterstitialImpression',
};

export const InterstitialAd: InterstitialAdType = {
  isAdLoaded: CASMobileAds.isInterstitialAdLoaded,
  loadAd: CASMobileAds.loadInterstitialAd,
  showAd: CASMobileAds.showInterstitialAd,

  setAutoloadEnabled: CASMobileAds.setInterstitialAutoloadEnabled,
  setAutoshowEnabled: CASMobileAds.setInterstitialAutoshowEnabled,
  setMinInterval: CASMobileAds.setInterstitialMinInterval,
  restartInterval: CASMobileAds.restartInterstitialInterval,
  destroy: CASMobileAds.destroyInterstitial,

  addAdLoadedEventListener: (l) => addEventListener(E.LOADED, l),
  addAdLoadFailedEventListener: (l) => addEventListener(E.LOAD_FAILED, l),
  addAdClickedEventListener: (l) => addEventListener(E.CLICKED, l),
  addAdShowedEventListener: (l) => addEventListener(E.DISPLAYED, l),
  addAdFailedToShowEventListener: (l) => addEventListener(E.FAILED_TO_SHOW, l),
  addAdDismissedEventListener: (l) => addEventListener(E.HIDDEN, l),
  addAdImpressionEventListener: (l) => addEventListener(E.IMPRESSION, l),

  removeAdLoadedEventListener: () => removeEventListener(E.LOADED),
  removeAdLoadFailedEventListener: () => removeEventListener(E.LOAD_FAILED),
  removeAdClickedEventListener: () => removeEventListener(E.CLICKED),
  removeAdShowedEventListener: () => removeEventListener(E.DISPLAYED),
  removeAdFailedToShowEventListener: () => removeEventListener(E.FAILED_TO_SHOW),
  removeAdDismissedEventListener: () => removeEventListener(E.HIDDEN),
  removeAdImpressionEventListener: () => removeEventListener(E.IMPRESSION),
};
