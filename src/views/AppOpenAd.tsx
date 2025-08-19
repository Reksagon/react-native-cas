import { addEventListener, removeEventListener } from '../EventEmitter';
import { NativeModules } from 'react-native';
import type { FullscreenAdType } from '../types/FullscreenAdType';

const { MediationManagerModule } = NativeModules;

const EVENTS = {
  LOADED: 'onAppOpenLoaded',
  LOAD_FAILED: 'onAppOpenLoadFailed',
  CLICKED: 'onAppOpenClicked',
  DISPLAYED: 'onAppOpenDisplayed',
  FAILED_TO_SHOW: 'onAppOpenFailedToShow',
  HIDDEN: 'onAppOpenHidden',
  IMPRESSION: 'onAppOpenImpression',
};

const isAdReady = (): Promise<boolean> => {
  return MediationManagerModule.isAppOpenAdAvailable();
};

const loadAd = (isLandscape: boolean = false): Promise<void> => {
  return MediationManagerModule.loadAppOpenAd(isLandscape)
};

const showAd = (): Promise<void> => {
  return MediationManagerModule.showAppOpenAd();
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

export const AppOpenAd: FullscreenAdType = {
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
  removeAdImpressionEventListener
};

export default AppOpenAd;
