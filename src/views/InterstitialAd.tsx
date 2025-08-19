// InterstitialAd.ts
import { addEventListener, removeEventListener } from '../EventEmitter';
import { NativeModules } from 'react-native';
import type { FullscreenAdType } from '../types/FullscreenAdType';

const { MediationManagerModule } = NativeModules;

const EVENTS = {
  LOADED: 'onInterstitialLoaded',
  LOAD_FAILED: 'onInterstitialLoadFailed',
  CLICKED: 'onInterstitialClicked',
  DISPLAYED: 'onInterstitialDisplayed',
  FAILED_TO_SHOW: 'onInterstitialFailedToShow',
  HIDDEN: 'onInterstitialHidden',
  IMPRESSION: 'onInterstitialImpression',
};

const isAdReady = (): Promise<boolean> => {
  return MediationManagerModule.isInterstitialReady();
};

const loadAd = (): Promise<void> => {
  return MediationManagerModule.loadInterstitial();
};

const showAd = (): Promise<void> => {
  return MediationManagerModule.showInterstitial();
};

const addAdLoadedEventListener = (listener: () => void): void => {
  addEventListener(EVENTS.LOADED, listener);
};

const removeAdLoadedEventListener = (): void => {
  removeEventListener(EVENTS.LOADED);
};

const addAdLoadFailedEventListener = (listener: (error: string) => void): void => {
  addEventListener(EVENTS.LOAD_FAILED, listener);
};

const removeAdLoadFailedEventListener = (): void => {
  removeEventListener(EVENTS.LOAD_FAILED);
};

const addAdClickedEventListener = (listener: () => void): void => {
  addEventListener(EVENTS.CLICKED, listener);
};

const removeAdClickedEventListener = (): void => {
  removeEventListener(EVENTS.CLICKED);
};

const addAdDisplayedEventListener = (listener: () => void): void => {
  addEventListener(EVENTS.DISPLAYED, listener);
};

const removeAdDisplayedEventListener = (): void => {
  removeEventListener(EVENTS.DISPLAYED);
};

const addAdFailedToShowEventListener = (listener: (error: string) => void): void => {
  addEventListener(EVENTS.FAILED_TO_SHOW, listener);
};

const removeAdFailedToShowEventListener = (): void => {
  removeEventListener(EVENTS.FAILED_TO_SHOW);
};

const addAdDismissedEventListener = (listener: () => void): void => {
  addEventListener(EVENTS.HIDDEN, listener);
};

const removeAdDismissedEventListener = (): void => {
  removeEventListener(EVENTS.HIDDEN);
};

const addAdImpressionEventListener = (listener: (info: any) => void): void => {
  addEventListener(EVENTS.IMPRESSION, listener);
};

const removeAdImpressionEventListener = (): void => {
  removeEventListener(EVENTS.IMPRESSION);
};

export const InterstitialAd: FullscreenAdType = {
  isAdReady,
  loadAd,
  showAd,

  addAdLoadedEventListener,
  removeAdLoadedEventListener,

  addAdLoadFailedEventListener,
  removeAdLoadFailedEventListener,

  addAdClickedEventListener,
  removeAdClickedEventListener,

  addAdDisplayedEventListener,
  removeAdDisplayedEventListener,

  addAdFailedToShowEventListener,
  removeAdFailedToShowEventListener,

  addAdDismissedEventListener,
  removeAdDismissedEventListener,

  addAdImpressionEventListener,
  removeAdImpressionEventListener,
};

export default InterstitialAd;
