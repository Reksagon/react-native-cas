import {
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import type { CASSpec } from './CASMobileAdsSpec';
import type {
  BuildManagerParams,
  InitConfiguration,
  TargetingOptions,
  CASSettings,
  AdViewSize,
} from '../types/Types';

const { MediationManagerModule, CASMobileAds: CASMobileAdsNative } =
  NativeModules as unknown as {
    MediationManagerModule: any;
    CASMobileAds: CASSpec;
  };

const eventEmitter = new NativeEventEmitter(NativeModules.CASMobileAds);

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
    return hasFn(CASMobileAdsNative, 'isInterstitialAdLoaded')
      ? CASMobileAdsNative.isInterstitialAdLoaded()
      : MediationManagerModule.isInterstitialReady();
  }

  static loadInterstitialAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'loadInterstitialAd')
      ? CASMobileAdsNative.loadInterstitialAd()
      : MediationManagerModule.loadInterstitial();
  }

  static showInterstitialAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'showInterstitialAd')
      ? CASMobileAdsNative.showInterstitialAd()
      : MediationManagerModule.showInterstitial('global');
  }

  static isRewardedAdLoaded(): Promise<boolean> {
    return hasFn(CASMobileAdsNative, 'isRewardedAdLoaded')
      ? CASMobileAdsNative.isRewardedAdLoaded()
      : MediationManagerModule.isRewardedAdReady();
  }

  static loadRewardedAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'loadRewardedAd')
      ? CASMobileAdsNative.loadRewardedAd()
      : MediationManagerModule.loadRewardedAd();
  }

  static showRewardedAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'showRewardedAd')
      ? CASMobileAdsNative.showRewardedAd()
      : MediationManagerModule.showRewardedAd('global');
  }

  static isAppOpenAdLoaded(): Promise<boolean> {
    return hasFn(CASMobileAdsNative, 'isAppOpenAdLoaded')
      ? CASMobileAdsNative.isAppOpenAdLoaded()
      : MediationManagerModule.isAppOpenAdAvailable();
  }

  static loadAppOpenAd(isLandscape: boolean = true): Promise<void> {
    return hasFn(CASMobileAdsNative, 'loadAppOpenAd')
      ? CASMobileAdsNative.loadAppOpenAd(isLandscape)
      : MediationManagerModule.loadAppOpenAd(isLandscape);
  }

  static showAppOpenAd(): Promise<void> {
    return hasFn(CASMobileAdsNative, 'showAppOpenAd')
      ? CASMobileAdsNative.showAppOpenAd()
      : MediationManagerModule.showAppOpenAd('global');
  }

  static async getSDKVersion(): Promise<string> {
    return hasFn(CASMobileAdsNative, 'getSDKVersion')
      ? CASMobileAdsNative.getSDKVersion()
      : 'unknown';
  }

  static setTestMode(enabled: boolean) {
    if (hasFn(CASMobileAdsNative, 'setTestMode')) {
      CASMobileAdsNative.setTestMode(enabled);
    }
  }

  static async showConsentFlow() {
    if (hasFn(CASMobileAdsNative, 'showConsentFlow')) {
      return CASMobileAdsNative.showConsentFlow();
    }
  }

  static setConsentFlowEnabled(enabled: boolean) {
    if (hasFn(CASMobileAdsNative, 'setConsentFlowEnabled')) {
      CASMobileAdsNative.setConsentFlowEnabled(enabled);
    }
  }

  static addConsentFlowDismissedEventListener(listener: (status: number) => void): () => void {
    const sub = eventEmitter.addListener('consentFlowDismissed', listener);
    return () => sub.remove();
  }

  static async getTargetingOptions(): Promise<TargetingOptions> {
    return hasFn(CASMobileAdsNative, 'getTargetingOptions')
      ? CASMobileAdsNative.getTargetingOptions()
      : ({ age: 0, gender: 0, keywords: [] } as TargetingOptions);
  }

  static async setTargetingOptions(options: Partial<TargetingOptions>) {
    if (hasFn(CASMobileAdsNative, 'setTargetingOptions')) {
      return CASMobileAdsNative.setTargetingOptions(options);
    }
  }

  static async getSettings(): Promise<CASSettings> {
    return hasFn(CASMobileAdsNative, 'getSettings')
      ? CASMobileAdsNative.getSettings()
      : ({
          taggedAudience: 0,
          age: 0,
          gender: 0,
          keywords: [],
          debugMode: false,
          mutedAdSounds: false,
          testDeviceIDs: [],
        } as CASSettings);
  }

  static async setSettings(settings: Partial<CASSettings>) {
    if (hasFn(CASMobileAdsNative, 'setSettings')) {
      return CASMobileAdsNative.setSettings(settings);
    }
  }
}