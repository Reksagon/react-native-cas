import { CASMobileAds } from '../modules/CASMobileAds';
import type { InterstitialAdType } from '../types/FullscreenAdType';
import { addEventListener } from '../EventEmitter';

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
