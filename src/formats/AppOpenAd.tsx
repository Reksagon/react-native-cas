import { CASMobileAds } from '../modules/CASMobileAds';
import type { AppOpenAdType } from '../types/FullscreenAdType';
import { addEventListener } from '../EventEmitter';

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
