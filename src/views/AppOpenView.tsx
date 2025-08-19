import { addEventListener, removeEventListener } from '../EventEmitter';
import { NativeModules } from 'react-native';

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

export class AppOpenAd {
  static loadAd(isLandscape: boolean = false): Promise<void> {
    return MediationManagerModule.loadAppOpenAd(isLandscape);
  }

  static isAdAvailable(): Promise<boolean> {
    return MediationManagerModule.isAppOpenAdAvailable();
  }

  static showAd(): Promise<void> {
    return MediationManagerModule.showAppOpenAd();
  }

  static addAdLoadedEventListener(listener: () => void) {
    addEventListener(EVENTS.LOADED, listener);
  }
  static removeAdLoadedEventListener() {
    removeEventListener(EVENTS.LOADED);
  }

  static addAdLoadFailedEventListener(listener: (error: string) => void) {
    addEventListener(EVENTS.LOAD_FAILED, listener);
  }
  static removeAdLoadFailedEventListener() {
    removeEventListener(EVENTS.LOAD_FAILED);
  }

  static addAdClickedEventListener(listener: () => void) {
    addEventListener(EVENTS.CLICKED, listener);
  }
  static removeAdClickedEventListener() {
    removeEventListener(EVENTS.CLICKED);
  }

  static addAdDisplayedEventListener(listener: () => void) {
    addEventListener(EVENTS.DISPLAYED, listener);
  }
  static removeAdDisplayedEventListener() {
    removeEventListener(EVENTS.DISPLAYED);
  }

  static addAdFailedToShowEventListener(listener: (error: string) => void) {
    addEventListener(EVENTS.FAILED_TO_SHOW, listener);
  }
  static removeAdFailedToShowEventListener() {
    removeEventListener(EVENTS.FAILED_TO_SHOW);
  }

  static addAdDismissedEventListener(listener: () => void) {
    addEventListener(EVENTS.HIDDEN, listener);
  }
  static removeAdDismissedEventListener() {
    removeEventListener(EVENTS.HIDDEN);
  }

  static addAdImpressionEventListener(listener: (info: any) => void) {
    addEventListener(EVENTS.IMPRESSION, listener);
  }
  static removeAdImpressionEventListener() {
    removeEventListener(EVENTS.IMPRESSION);
  }
}