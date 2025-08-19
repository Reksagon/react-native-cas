import { addEventListener, removeEventListener } from '../EventEmitter';
import { NativeModules } from 'react-native';

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

export class InterstitialAd {
  static loadAd(): Promise<void> {
    return MediationManagerModule.loadInterstitial();
  }

  static isAdReady(): Promise<boolean> {
    return MediationManagerModule.isInterstitialReady();
  }

  static showAd(): Promise<void> {
    return MediationManagerModule.showInterstitial();
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
