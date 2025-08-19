import { addEventListener, removeEventListener } from '../EventEmitter';
import { NativeModules } from 'react-native';

const { MediationManagerModule } = NativeModules;

const EVENTS = {
  LOADED: 'onRewardedLoaded',
  LOAD_FAILED: 'onRewardedLoadFailed',
  CLICKED: 'onRewardedClicked',
  DISPLAYED: 'onRewardedDisplayed',
  FAILED_TO_SHOW: 'onRewardedFailedToShow',
  HIDDEN: 'onRewardedHidden',
  COMPLETED: 'onRewardedCompleted',
  IMPRESSION: 'onRewardedImpression',
};

export class RewardedAd {
  static loadAd(): Promise<void> {
    return MediationManagerModule.loadRewardedAd();
  }

  static isAdReady(): Promise<boolean> {
    return MediationManagerModule.isRewardedAdReady();
  }

  static showAd(): Promise<void> {
    return MediationManagerModule.showRewardedAd();
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

  static addAdCompletedEventListener(listener: () => void) {
    addEventListener(EVENTS.COMPLETED, listener);
  }
  static removeAdCompletedEventListener() {
    removeEventListener(EVENTS.COMPLETED);
  }

  static addAdImpressionEventListener(listener: (info: any) => void) {
    addEventListener(EVENTS.IMPRESSION, listener);
  }
  static removeAdImpressionEventListener() {
    removeEventListener(EVENTS.IMPRESSION);
  }
}
