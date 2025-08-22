import type {
  BuildManagerParams,
  InitConfiguration,
  TargetingOptions,
  CASSettings
} from '../utils/types';
import CASMobileAdsModule from './CASMobileAdsSpec';
import { NativeEventEmitter, NativeModules } from 'react-native';

const eventEmitter = new NativeEventEmitter(CASMobileAdsModule);
const { MediationManagerModule } = NativeModules;
const GLOBAL_CB_ID = 'global';

export class CASMobileAds {
  static initialize(params: BuildManagerParams): Promise<InitConfiguration> {
    return CASMobileAdsModule.initialize(params);
  }

  static getSDKVersion(): Promise<string> {
    return CASMobileAdsModule.getSDKVersion();
  }

  static showConsentFlow() {
    return CASMobileAdsModule.showConsentFlow();
  }
  static setConsentFlowEnabled(enabled: boolean) {
    return CASMobileAdsModule.setConsentFlowEnabled(enabled);
  }

  static addConsentFlowDismissedEventListener(
    listener: (status: number) => void
  ): () => void {
    const sub = eventEmitter.addListener('consentFlowDismissed', listener);
    return () => sub.remove();
  }

  static getSettings(): Promise<CASSettings> {
    return CASMobileAdsModule.getSettings();
  }
  static setSettings(settings: Partial<CASSettings>) {
    return CASMobileAdsModule.setSettings(settings);
  }

  static getTargetingOptions(): Promise<TargetingOptions> {
    return CASMobileAdsModule.getTargetingOptions();
  }
  static setTargetingOptions(options: Partial<TargetingOptions>) {
    return CASMobileAdsModule.setTargetingOptions(options);
  }

  static isInterstitialAdLoaded() { return MediationManagerModule.isInterstitialReady(); }
  static loadInterstitialAd() { return MediationManagerModule.loadInterstitial(); }
  static showInterstitialAd() { return MediationManagerModule.showInterstitial(GLOBAL_CB_ID); }

  static isRewardedAdLoaded() { return MediationManagerModule.isRewardedAdReady(); }
  static loadRewardedAd() { return MediationManagerModule.loadRewardedAd(); }
  static showRewardedAd() { return MediationManagerModule.showRewardedAd(GLOBAL_CB_ID); }

  static isAppOpenAdLoaded() { return MediationManagerModule.isAppOpenAdAvailable(); }
  static loadAppOpenAd(isLandscape = true) { return MediationManagerModule.loadAppOpenAd(isLandscape); }
  static showAppOpenAd() { return MediationManagerModule.showAppOpenAd(GLOBAL_CB_ID); }
}
