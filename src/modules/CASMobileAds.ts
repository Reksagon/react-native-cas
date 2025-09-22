import { NativeModules, NativeEventEmitter } from 'react-native';
import type { CASSpec } from './CASMobileAdsSpec';
import type {
  BuildManagerParams,
  InitConfiguration,
  CASSettings,
} from '../types/Types';

const { CASMobileAds: CASMobileAdsNative } = NativeModules as unknown as {
  CASMobileAds: CASSpec;
};

export const eventEmitter = new NativeEventEmitter(NativeModules.CASMobileAds);

function hasFn(obj: any, name: string): boolean {
  return !!obj && typeof obj[name] === 'function';
}

const BANNER_FALLBACK_HEIGHT = 50;

export class CASMobileAds {
  //Init

  static async setMediationExtras(key:string, value:string){
    // TODO
  }

  static async initialize(casId: string, testMode: boolean): Promise<InitConfiguration> {
    // TODO: Remove hasFn
    if (hasFn(CASMobileAdsNative, 'initialize')) {
      return CASMobileAdsNative.initialize(casId, testMode);
    }
    throw new Error('CASMobileAds native module: initialize not implemented');
  }

  static async isInitialized(): Promise<boolean> {
    if (hasFn(CASMobileAdsNative, 'isInitialized')) {
      return CASMobileAdsNative.isInitialized();
    }
    return true;
  }

  //Adaptive 
  static async getAdaptiveBannerHeightForWidth(width: number): Promise<number> {
    if (hasFn(CASMobileAdsNative, 'getAdaptiveBannerHeightForWidth')) {
      return CASMobileAdsNative.getAdaptiveBannerHeightForWidth(width);
    }
    return BANNER_FALLBACK_HEIGHT;
  }

  //Interstitial
  static isInterstitialAdLoaded(): Promise<boolean> {
    return hasFn(CASMobileAdsNative, 'isInterstitialAdLoaded')
      ? CASMobileAdsNative.isInterstitialAdLoaded()
      : Promise.resolve(false);
  }
  static loadInterstitialAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'loadInterstitialAd')
      ? CASMobileAdsNative.loadInterstitialAd()
      : Promise.reject(new Error('loadInterstitialAd not implemented'));
  }
  static showInterstitialAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'showInterstitialAd')
      ? CASMobileAdsNative.showInterstitialAd()
      : Promise.reject(new Error('showInterstitialAd not implemented'));
  }

  //Rewarded
  static isRewardedAdLoaded(): Promise<boolean> {
    return hasFn(CASMobileAdsNative, 'isRewardedAdLoaded')
      ? CASMobileAdsNative.isRewardedAdLoaded()
      : Promise.resolve(false);
  }
  static loadRewardedAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'loadRewardedAd')
      ? CASMobileAdsNative.loadRewardedAd()
      : Promise.reject(new Error('loadRewardedAd not implemented'));
  }
  static showRewardedAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'showRewardedAd')
      ? CASMobileAdsNative.showRewardedAd()
      : Promise.reject(new Error('showRewardedAd not implemented'));
  }

  //AppOpen
  static isAppOpenAdLoaded(): Promise<boolean> {
    return hasFn(CASMobileAdsNative, 'isAppOpenAdLoaded')
      ? CASMobileAdsNative.isAppOpenAdLoaded()
      : Promise.resolve(false);
  }
  static loadAppOpenAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'loadAppOpenAd')
      ? CASMobileAdsNative.loadAppOpenAd()
      : Promise.reject(new Error('loadAppOpenAd not implemented'));
  }
  static showAppOpenAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'showAppOpenAd')
      ? CASMobileAdsNative.showAppOpenAd()
      : Promise.reject(new Error('showAppOpenAd not implemented'));
  }

  //Consent
  static showConsentFlow(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'showConsentFlow')
      ? CASMobileAdsNative.showConsentFlow()
      : Promise.resolve();
  }
  static setConsentFlowEnabled(enabled: boolean): void {
    if (hasFn(CASMobileAdsNative, 'setConsentFlowEnabled')) {
      CASMobileAdsNative.setConsentFlowEnabled(enabled);
    }
  }
  static addConsentFlowDismissedEventListener(listener: (status: number) => void): () => void {
    const sub = eventEmitter.addListener('consentFlowDismissed', listener);
    return () => sub.remove();
  }

  //Misc
  static getSDKVersion(): Promise<string> {
    return hasFn(CASMobileAdsNative, 'getSDKVersion')
      ? CASMobileAdsNative.getSDKVersion()
      : Promise.resolve('unknown');
  }
  static setTestMode(enabled: boolean) {
    if (hasFn(CASMobileAdsNative, 'setTestMode')) {
      CASMobileAdsNative.setTestMode(enabled);
    }
  }

  //Settings
  static getSettings(): Promise<CASSettings> {
    return hasFn(CASMobileAdsNative, 'getSettings')
      ? CASMobileAdsNative.getSettings()
      : Promise.resolve({
          taggedAudience: 0,
          age: 0,
          gender: 0,
          keywords: [],
          debugMode: false,
          mutedAdSounds: false,
          testDeviceIDs: [],
        } as CASSettings);
  }
  static setSettings(settings: Partial<CASSettings>) {
    return hasFn(CASMobileAdsNative, 'setSettings')
      ? CASMobileAdsNative.setSettings(settings)
      : Promise.resolve();
  }
}
