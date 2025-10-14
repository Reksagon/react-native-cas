import { CASMobileAds } from '../CASMobileAds';
import type { AppOpenAdType } from '../types/FullscreenAdType';
import { addEventListener, removeEventListener } from '../EventEmitter';

const E = {
  LOADED: 'onAppOpenLoaded',
  LOAD_FAILED: 'onAppOpenLoadFailed',
  CLICKED: 'onAppOpenClicked',
  DISPLAYED: 'onAppOpenDisplayed',
  FAILED_TO_SHOW: 'onAppOpenFailedToShow',
  HIDDEN: 'onAppOpenHidden',
  IMPRESSION: 'onAppOpenImpression',
};

export const AppOpenAd: AppOpenAdType = {
  isAdLoaded: CASMobileAds.isAppOpenAdLoaded,
  loadAd: CASMobileAds.loadAppOpenAd,
  showAd: CASMobileAds.showAppOpenAd,
  setAutoloadEnabled: CASMobileAds.setAppOpenAutoloadEnabled,
  setAutoshowEnabled: CASMobileAds.setAppOpenAutoshowEnabled,
  destroy: CASMobileAds.destroyAppOpen,

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
