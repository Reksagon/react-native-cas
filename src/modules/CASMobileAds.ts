import { NativeModules, NativeEventEmitter } from 'react-native';
import NativeCASMobileAds from './NativeCASMobileAdsModule';
import type {
  BuildManagerParams,
  InitConfiguration,
  CASSettings,
  Audience,
  Gender,
} from '../types/Types';

export const eventEmitter = new NativeEventEmitter(NativeModules.CASMobileAds);

function hasFn(obj: any, name: string): boolean {
  return !!obj && typeof obj[name] === 'function';
}

const BANNER_FALLBACK_HEIGHT = 50;

export class CASMobileAds {
  //Init
  static async initialize(params: {
  casId?: string;
  testMode?: boolean;
}): Promise<InitConfiguration> {
      return NativeCASMobileAds.initialize(params);
    
    throw new Error('CASMobileAds native module: initialize not implemented');
  }

  static async isInitialized(): Promise<boolean> {
      return NativeCASMobileAds.isInitialized();
    
    return true;
  }

  //Adaptive 
  static async getAdaptiveBannerHeightForWidth(width: number): Promise<number> {
      return NativeCASMobileAds.getAdaptiveBannerHeightForWidth(width);
    
    return BANNER_FALLBACK_HEIGHT;
  }

  //Interstitial
  static isInterstitialAdLoaded(): Promise<boolean> {
    return NativeCASMobileAds.isInterstitialAdLoaded();
  }
  static loadInterstitialAd(): Promise<void> {
    return NativeCASMobileAds.loadInterstitialAd();
  }
  static showInterstitialAd(): Promise<void> {
    return NativeCASMobileAds.showInterstitialAd();
  }

  //Rewarded
  static isRewardedAdLoaded(): Promise<boolean> {
    return NativeCASMobileAds.isRewardedAdLoaded();
  }
  static loadRewardedAd(): Promise<void> {
    return NativeCASMobileAds.loadRewardedAd();
  }
  static showRewardedAd(): Promise<void> {
    return NativeCASMobileAds.showRewardedAd();
  }

  //AppOpen
  static isAppOpenAdLoaded(): Promise<boolean> {
    return NativeCASMobileAds.isAppOpenAdLoaded()
  }
  static loadAppOpenAd(): Promise<void> {
    return NativeCASMobileAds.loadAppOpenAd();
  }
  static showAppOpenAd(): Promise<void> {
    return NativeCASMobileAds.showAppOpenAd();
  }

  //Consent
  static showConsentFlow(): Promise<void> {
    return NativeCASMobileAds.showConsentFlow();
  }
  static setConsentFlowEnabled(enabled: boolean): void {
      NativeCASMobileAds.setConsentFlowEnabled(enabled);
    
  }
  static addConsentFlowDismissedEventListener(listener: (status: number) => void): () => void {
    const sub = eventEmitter.addListener('consentFlowDismissed', listener);
    return () => sub.remove();
  }

  //Misc
  static getSDKVersion(): Promise<string> {
    return NativeCASMobileAds.getSDKVersion();
  }

  //Settings
  static getSettings(): Promise<CASSettings> {
    return NativeCASMobileAds.getSettings();
  }
  static setSettings(settings: CASSettings) {
    return NativeCASMobileAds.setSettings(settings);
  }
}
