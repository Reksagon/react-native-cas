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
  isAdLoaded: CASMobileAds.isAppOpenAdLoaded,
  loadAd: () => CASMobileAds.loadAppOpenAd(true as any),
  showAd: CASMobileAds.showAppOpenAd,

  addAdLoadedEventListener: (l) => addEventListener(EVENTS.LOADED, l),
  removeAdLoadedEventListener: () => removeEventListener(EVENTS.LOADED),

  addAdLoadFailedEventListener: (l) => addEventListener(EVENTS.LOAD_FAILED, l),
  removeAdLoadFailedEventListener: () => removeEventListener(EVENTS.LOAD_FAILED),

  addAdClickedEventListener: (l) => addEventListener(EVENTS.CLICKED, l),
  removeAdClickedEventListener: () => removeEventListener(EVENTS.CLICKED),

  addAdDisplayedEventListener: (l) => addEventListener(EVENTS.DISPLAYED, l),
  removeAdDisplayedEventListener: () => removeEventListener(EVENTS.DISPLAYED),

  addAdFailedToShowEventListener: (l) => addEventListener(EVENTS.FAILED_TO_SHOW, l),
  removeAdFailedToShowEventListener: () => removeEventListener(EVENTS.FAILED_TO_SHOW),

  addAdDismissedEventListener: (l) => addEventListener(EVENTS.HIDDEN, l),
  removeAdDismissedEventListener: () => removeEventListener(EVENTS.HIDDEN),

  addAdImpressionEventListener: (l) => addEventListener(EVENTS.IMPRESSION, l),
  removeAdImpressionEventListener: () => removeEventListener(EVENTS.IMPRESSION),
};