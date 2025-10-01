import { CASMobileAds } from '../modules/CASMobileAds';
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
