import CASMobileAdsNative from '../modules/NativeCASMobileAdsModule';
import type { InterstitialAdType } from '../types/FullscreenAds';
import { addAdEventListener } from '../EventEmitter';

enum InterstitialAdEvent {
  LOADED = 'onInterstitialLoaded',
  FAILED_TO_LOAD = 'onInterstitialFailedToLoad',
  FAILED_TO_SHOW = 'onInterstitialFailedToShow',
  SHOWED = 'onInterstitialShowed',
  CLICKED = 'onInterstitialClicked',
  DISMISSED = 'onInterstitialDismissed',
  IMPRESSION = 'onInterstitialImpression',
}

export const InterstitialAd: InterstitialAdType = {
  isAdLoaded: CASMobileAdsNative.isInterstitialAdLoaded,
  loadAd: CASMobileAdsNative.loadInterstitialAd,
  showAd: CASMobileAdsNative.showInterstitialAd,

  setAutoloadEnabled: CASMobileAdsNative.setInterstitialAutoloadEnabled,
  setAutoshowEnabled: CASMobileAdsNative.setInterstitialAutoshowEnabled,
  setMinInterval: CASMobileAdsNative.setInterstitialMinInterval,
  restartInterval: CASMobileAdsNative.restartInterstitialInterval,
  destroy: CASMobileAdsNative.destroyInterstitial,

  addAdLoadedEventListener: l => addAdEventListener(InterstitialAdEvent.LOADED, l),
  addAdFailedToLoadEventListener: l => addAdEventListener(InterstitialAdEvent.FAILED_TO_LOAD, l),
  addAdClickedEventListener: l => addAdEventListener(InterstitialAdEvent.CLICKED, l),
  addAdShowedEventListener: l => addAdEventListener(InterstitialAdEvent.SHOWED, l),
  addAdFailedToShowEventListener: l => addAdEventListener(InterstitialAdEvent.FAILED_TO_SHOW, l),
  addAdDismissedEventListener: l => addAdEventListener(InterstitialAdEvent.DISMISSED, l),
  addAdImpressionEventListener: l => addAdEventListener(InterstitialAdEvent.IMPRESSION, l),
};
