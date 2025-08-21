import type {
  BuildManagerParams,
  InitConfiguration,
  TargetingOptions,
  CASSettings,
  LastPageAdContent,      
} from '../utils/types';
import CASMobileAdsModule from './CASMobileAdsSpec';
import { NativeEventEmitter, NativeModules } from 'react-native';

const eventEmitter = new NativeEventEmitter(CASMobileAdsModule);
const { MediationManagerModule } = NativeModules;

const GLOBAL_CB_ID = 'global';

export class CASMobileAds {
  static async initialize(params: BuildManagerParams): Promise<InitConfiguration> {
    return CASMobileAdsModule.initialize(params);
  }

  static async getSDKVersion(): Promise<string> {
    return CASMobileAdsModule.getSDKVersion();
  }

  static setTestMode(enabled: boolean) {
    if (typeof (CASMobileAdsModule as any).setTestMode === 'function') {
      (CASMobileAdsModule as any).setTestMode(enabled);
    }
  }

  static async showConsentFlow() {
    return CASMobileAdsModule.showConsentFlow();
  }

  static async setConsentFlowEnabled(enabled: boolean) {
    if (typeof (CASMobileAdsModule as any).setConsentFlowEnabled === 'function') {
      return (CASMobileAdsModule as any).setConsentFlowEnabled(enabled);
    }
  }

  static addConsentFlowDismissedEventListener(listener: (status: number) => void): () => void {
    const sub = eventEmitter.addListener('consentFlowDismissed', (status: number) => listener(status));
    return () => sub.remove();
  }

  static async getTargetingOptions(): Promise<TargetingOptions> {
    return CASMobileAdsModule.getTargetingOptions();
  }

  static async setTargetingOptions(options: Partial<TargetingOptions>) {
    return CASMobileAdsModule.setTargetingOptions(options);
  }

  static async getSettings(): Promise<CASSettings> {
    return CASMobileAdsModule.getSettings();
  }

  static async setSettings(settings: Partial<CASSettings>) {
    return CASMobileAdsModule.setSettings(settings);
  }

  static isInterstitialAdLoaded() {
    return MediationManagerModule.isInterstitialReady();
  }
  static loadInterstitialAd() {
    return MediationManagerModule.loadInterstitial();
  }
  static showInterstitialAd() {
    return MediationManagerModule.showInterstitial(GLOBAL_CB_ID);
  }

  static isRewardedAdLoaded() {
    return MediationManagerModule.isRewardedAdReady();
  }
  static loadRewardedAd() {
    return MediationManagerModule.loadRewardedAd();
  }
  static showRewardedAd() {
    return MediationManagerModule.showRewardedAd(GLOBAL_CB_ID);
  }

  static isAppOpenAdLoaded() {
    return MediationManagerModule.isAppOpenAdAvailable();
  }
  static loadAppOpenAd(isLandscape: boolean = true) {
    return MediationManagerModule.loadAppOpenAd(isLandscape);
  }
  static showAppOpenAd() {
    return MediationManagerModule.showAppOpenAd(GLOBAL_CB_ID);
  }

  static async setLastPageAdContent(params: LastPageAdContent): Promise<void> {
    if (MediationManagerModule?.setLastPageAdContent) {
      return MediationManagerModule.setLastPageAdContent(params);
    }
    return Promise.resolve();
  }

  static enableAppReturnAds() {
  return MediationManagerModule.enableAppReturnAds('global');
}
static disableAppReturnAds() {
  return MediationManagerModule.disableAppReturnAds();
}
static skipNextAppReturnAds() {
  return MediationManagerModule.skipNextAppReturnAds();
}
}
