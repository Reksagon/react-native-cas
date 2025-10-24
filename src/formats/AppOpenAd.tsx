import CASMobileAdsNative from '../modules/NativeCASMobileAdsModule';
import type { AppOpenAdType } from '../types/FullscreenAds';
import { addAdEventListener } from '../EventEmitter';

export enum AppOpenAdEvent {
  LOADED = 'onAppOpenLoaded',
  FAILED_TO_LOAD = 'onAppOpenFailedToLoad',
  FAILED_TO_SHOW = 'onAppOpenFailedToShow',
  SHOWED = 'onAppOpenShowed',
  CLICKED = 'onAppOpenClicked',
  DISMISSED = 'onAppOpenDismissed',
  IMPRESSION = 'onAppOpenImpression',
}

export const AppOpenAd: AppOpenAdType = {
  isAdLoaded: CASMobileAdsNative.isAppOpenAdLoaded,
  loadAd: CASMobileAdsNative.loadAppOpenAd,
  showAd: CASMobileAdsNative.showAppOpenAd,
  setAutoloadEnabled: CASMobileAdsNative.setAppOpenAutoloadEnabled,
  setAutoshowEnabled: CASMobileAdsNative.setAppOpenAutoshowEnabled,
  destroy: CASMobileAdsNative.destroyAppOpen,

  addAdLoadedEventListener: l => addAdEventListener(AppOpenAdEvent.LOADED, l),
  addAdFailedToLoadEventListener: l => addAdEventListener(AppOpenAdEvent.FAILED_TO_LOAD, l),
  addAdFailedToShowEventListener: l => addAdEventListener(AppOpenAdEvent.FAILED_TO_SHOW, l),
  addAdShowedEventListener: l => addAdEventListener(AppOpenAdEvent.SHOWED, l),
  addAdClickedEventListener: l => addAdEventListener(AppOpenAdEvent.CLICKED, l),
  addAdImpressionEventListener: l => addAdEventListener(AppOpenAdEvent.IMPRESSION, l),
  addAdDismissedEventListener: l => addAdEventListener(AppOpenAdEvent.DISMISSED, l),
};
