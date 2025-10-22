import CASMobileAdsNative from '../modules/NativeCASMobileAdsModule';
import type { InterstitialAdType } from '../types/FullscreenAds';
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
  isAdLoaded: CASMobileAdsNative.isInterstitialAdLoaded,
  loadAd: CASMobileAdsNative.loadInterstitialAd,
  showAd: CASMobileAdsNative.showInterstitialAd,

  setAutoloadEnabled: CASMobileAdsNative.setInterstitialAutoloadEnabled,
  setAutoshowEnabled: CASMobileAdsNative.setInterstitialAutoshowEnabled,
  setMinInterval: CASMobileAdsNative.setInterstitialMinInterval,
  restartInterval: CASMobileAdsNative.restartInterstitialInterval,
  destroy: CASMobileAdsNative.destroyInterstitial,

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
