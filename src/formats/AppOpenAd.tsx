import CASMobileAdsNative from '../modules/NativeCASMobileAdsModule';
import type { AppOpenAdType } from '../types/FullscreenAds';
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
  isAdLoaded: CASMobileAdsNative.isAppOpenAdLoaded,
  loadAd: CASMobileAdsNative.loadAppOpenAd,
  showAd: CASMobileAdsNative.showAppOpenAd,
  setAutoloadEnabled: CASMobileAdsNative.setAppOpenAutoloadEnabled,
  setAutoshowEnabled: CASMobileAdsNative.setAppOpenAutoshowEnabled,
  destroy: CASMobileAdsNative.destroyAppOpen,

  addAdLoadedEventListener: (l) => addEventListener(E.LOADED, l),
  addAdLoadFailedEventListener: (l) => addEventListener(E.LOAD_FAILED, l),
  addAdClickedEventListener: (l) => addEventListener(E.CLICKED, l),
  addAdShowedEventListener: (l) => addEventListener(E.DISPLAYED, l),
  addAdFailedToShowEventListener:(l) => addEventListener(E.FAILED_TO_SHOW, l),
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
