import { NativeModules, NativeEventEmitter } from 'react-native';
import type { CASSpec } from './CASMobileAdsSpec';
import type {
  BuildManagerParams,
  InitConfiguration,
  TargetingOptions,
  CASSettings,
  AdViewSize,
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
  static async initialize(params: BuildManagerParams): Promise<InitConfiguration> {
    if (hasFn(CASMobileAdsNative, 'initialize')) {
      return CASMobileAdsNative.initialize(params);
    }
    throw new Error('CASMobileAds native module: initialize not implemented');
  }

  static async isInitialized(): Promise<boolean> {
    if (hasFn(CASMobileAdsNative, 'isInitialized')) {
      return CASMobileAdsNative.isInitialized();
    }
    return true;
  }

  static async preloadNativeUIComponentAdView(
    adUnitId: string,
    adFormat: string,
    adViewSize: AdViewSize,
    placement: string | null = null,
    customData: string | null = null,
    extraParameters: Record<string, any> = {},
    localExtraParameters: Record<string, any> = {}
  ): Promise<number> {
    if (hasFn(CASMobileAdsNative, 'preloadNativeUIComponentAdView')) {
      return CASMobileAdsNative.preloadNativeUIComponentAdView(
        adUnitId,
        adFormat,
        adViewSize,
        placement,
        customData,
        extraParameters,
        localExtraParameters
      );
    }
    throw new Error('preloadNativeUIComponentAdView is not implemented on native side');
  }

  static async destroyNativeUIComponentAdView(adViewId: number): Promise<void> {
    if (hasFn(CASMobileAdsNative, 'destroyNativeUIComponentAdView')) {
      return CASMobileAdsNative.destroyNativeUIComponentAdView(adViewId);
    }
    throw new Error('destroyNativeUIComponentAdView is not implemented on native side');
  }

  static async getAdaptiveBannerHeightForWidth(width: number): Promise<number> {
    if (hasFn(CASMobileAdsNative, 'getAdaptiveBannerHeightForWidth')) {
      return CASMobileAdsNative.getAdaptiveBannerHeightForWidth(width);
    }
    return BANNER_FALLBACK_HEIGHT;
  }

  static isInterstitialAdLoaded(): Promise<boolean> {
    if (hasFn(CASMobileAdsNative, 'isInterstitialAdLoaded')) {
      return CASMobileAdsNative.isInterstitialAdLoaded();
    }
    return Promise.resolve(false);
  }
  static loadInterstitialAd(): Promise<void> {
    if (hasFn(CASMobileAdsNative, 'loadInterstitialAd')) {
      return CASMobileAdsNative.loadInterstitialAd();
    }
    return Promise.reject(new Error('loadInterstitialAd not implemented'));
  }
  static showInterstitialAd(): Promise<void> {
    if (hasFn(CASMobileAdsNative, 'showInterstitialAd')) {
      return CASMobileAdsNative.showInterstitialAd();
    }
    return Promise.reject(new Error('showInterstitialAd not implemented'));
  }

  static isRewardedAdLoaded(): Promise<boolean> {
    if (hasFn(CASMobileAdsNative, 'isRewardedAdLoaded')) {
      return CASMobileAdsNative.isRewardedAdLoaded();
    }
    return Promise.resolve(false);
  }
  static loadRewardedAd(): Promise<void> {
    if (hasFn(CASMobileAdsNative, 'loadRewardedAd')) {
      return CASMobileAdsNative.loadRewardedAd();
    }
    return Promise.reject(new Error('loadRewardedAd not implemented'));
  }
  static showRewardedAd(): Promise<void> {
    if (hasFn(CASMobileAdsNative, 'showRewardedAd')) {
      return CASMobileAdsNative.showRewardedAd();
    }
    return Promise.reject(new Error('showRewardedAd not implemented'));
  }

  static isAppOpenAdLoaded(): Promise<boolean> {
    if (hasFn(CASMobileAdsNative, 'isAppOpenAdLoaded')) {
      return CASMobileAdsNative.isAppOpenAdLoaded();
    }
    return Promise.resolve(false);
  }
  static loadAppOpenAd(isLandscape: boolean = true): Promise<void> {
    if (hasFn(CASMobileAdsNative, 'loadAppOpenAd')) {
      return CASMobileAdsNative.loadAppOpenAd(isLandscape);
    }
    return Promise.reject(new Error('loadAppOpenAd not implemented'));
  }
  static showAppOpenAd(): Promise<void> {
    if (hasFn(CASMobileAdsNative, 'showAppOpenAd')) {
      return CASMobileAdsNative.showAppOpenAd();
    }
    return Promise.reject(new Error('showAppOpenAd not implemented'));
  }

  static showConsentFlow(): Promise<void> {
    if (hasFn(CASMobileAdsNative, 'showConsentFlow')) {
      return CASMobileAdsNative.showConsentFlow();
    }
    return Promise.resolve();
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

  static getSDKVersion(): Promise<string> {
    if (hasFn(CASMobileAdsNative, 'getSDKVersion')) {
      return CASMobileAdsNative.getSDKVersion();
    }
    return Promise.resolve('unknown');
  }
  static setTestMode(enabled: boolean) {
    if (hasFn(CASMobileAdsNative, 'setTestMode')) {
      CASMobileAdsNative.setTestMode(enabled);
    }
  }

  static getTargetingOptions(): Promise<TargetingOptions> {
    if (hasFn(CASMobileAdsNative, 'getTargetingOptions')) {
      return CASMobileAdsNative.getTargetingOptions();
    }
    return Promise.resolve({ age: 0, gender: 0, keywords: [] } as TargetingOptions);
  }
  static setTargetingOptions(options: Partial<TargetingOptions>) {
    if (hasFn(CASMobileAdsNative, 'setTargetingOptions')) {
      return CASMobileAdsNative.setTargetingOptions(options);
    }
    return Promise.resolve();
  }

  static getSettings(): Promise<CASSettings> {
    if (hasFn(CASMobileAdsNative, 'getSettings')) {
      return CASMobileAdsNative.getSettings();
    }
    return Promise.resolve({
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
    if (hasFn(CASMobileAdsNative, 'setSettings')) {
      return CASMobileAdsNative.setSettings(settings);
    }
    return Promise.resolve();
  }
}
