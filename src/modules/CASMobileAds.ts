import type {
  BuildManagerParams,
  InitConfiguration,
  CASSettings,
  AdViewSize,
} from '../types/Types';

import CASMobileAdsModule from './CASMobileAdsSpec';
import { NativeEventEmitter, NativeModules } from 'react-native';

const eventEmitter = new NativeEventEmitter(CASMobileAdsModule as any);
const { MediationManagerModule } = NativeModules as any;

function hasFn(obj: any, name: string): boolean {
  return !!obj && typeof obj[name] === 'function';
}

const BANNER_FALLBACK_HEIGHT = 50;

export class CASMobileAds {
  static async initialize(params: BuildManagerParams): Promise<InitConfiguration> {
    if (hasFn(CASMobileAdsModule, 'initialize')) {
      return CASMobileAdsModule.initialize(params);
    }
    if (hasFn(CASMobileAdsModule, 'buildManager')) {
      return (CASMobileAdsModule as any).buildManager(params);
    }
    throw new Error('CASMobileAds native module: initialize/buildManager not implemented');
  }

  static async isInitialized(): Promise<boolean> {
    if (hasFn(CASMobileAdsModule, 'isInitialized')) {
      return (CASMobileAdsModule as any).isInitialized();
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
    if (hasFn(CASMobileAdsModule, 'preloadNativeUIComponentAdView')) {
      return (CASMobileAdsModule as any).preloadNativeUIComponentAdView(
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
    if (hasFn(CASMobileAdsModule, 'destroyNativeUIComponentAdView')) {
      return (CASMobileAdsModule as any).destroyNativeUIComponentAdView(adViewId);
    }
    throw new Error('destroyNativeUIComponentAdView is not implemented on native side');
  }

  static async getAdaptiveBannerHeightForWidth(width: number): Promise<number> {
    if (hasFn(CASMobileAdsModule, 'getAdaptiveBannerHeightForWidth')) {
      return (CASMobileAdsModule as any).getAdaptiveBannerHeightForWidth(width);
    }
    return BANNER_FALLBACK_HEIGHT;
  }

  static isInterstitialAdLoaded(): Promise<boolean> {
    if (hasFn(CASMobileAdsModule, 'isInterstitialAdLoaded')) {
      return CASMobileAdsModule.isInterstitialAdLoaded();
    }
    return MediationManagerModule.isInterstitialReady();
  }
  static loadInterstitialAd(): Promise<void> {
    if (hasFn(CASMobileAdsModule, 'loadInterstitialAd')) {
      return CASMobileAdsModule.loadInterstitialAd();
    }
    return MediationManagerModule.loadInterstitial();
  }
  static showInterstitialAd(): Promise<void> {
    if (hasFn(CASMobileAdsModule, 'showInterstitialAd')) {
      return CASMobileAdsModule.showInterstitialAd();
    }
    return MediationManagerModule.showInterstitial('global');
  }

  static isRewardedAdLoaded(): Promise<boolean> {
    if (hasFn(CASMobileAdsModule, 'isRewardedAdLoaded')) {
      return CASMobileAdsModule.isRewardedAdLoaded();
    }
    return MediationManagerModule.isRewardedAdReady();
  }
  static loadRewardedAd(): Promise<void> {
    if (hasFn(CASMobileAdsModule, 'loadRewardedAd')) {
      return CASMobileAdsModule.loadRewardedAd();
    }
    return MediationManagerModule.loadRewardedAd();
  }
  static showRewardedAd(): Promise<void> {
    if (hasFn(CASMobileAdsModule, 'showRewardedAd')) {
      return CASMobileAdsModule.showRewardedAd();
    }
    return MediationManagerModule.showRewardedAd('global');
  }

  static isAppOpenAdLoaded(): Promise<boolean> {
    if (hasFn(CASMobileAdsModule, 'isAppOpenAdLoaded')) {
      return CASMobileAdsModule.isAppOpenAdLoaded();
    }
    return MediationManagerModule.isAppOpenAdAvailable();
  }
  static loadAppOpenAd(isLandscape: boolean = true): Promise<void> {
    if (hasFn(CASMobileAdsModule, 'loadAppOpenAd')) {
      return (CASMobileAdsModule as any).loadAppOpenAd(isLandscape);
    }
    return MediationManagerModule.loadAppOpenAd(isLandscape);
  }
  static showAppOpenAd(): Promise<void> {
    if (hasFn(CASMobileAdsModule, 'showAppOpenAd')) {
      return CASMobileAdsModule.showAppOpenAd();
    }
    return MediationManagerModule.showAppOpenAd('global');
  }

  static async getSDKVersion(): Promise<string> {
    if (hasFn(CASMobileAdsModule, 'getSDKVersion')) {
      return CASMobileAdsModule.getSDKVersion();
    }
    return 'unknown';
  }

  static setTestMode(enabled: boolean) {
    if (hasFn(CASMobileAdsModule, 'setTestMode')) {
      CASMobileAdsModule.setTestMode(enabled);
    }
  }

  static async showConsentFlow() {
    if (hasFn(CASMobileAdsModule, 'showConsentFlow')) {
      return CASMobileAdsModule.showConsentFlow();
    }
  }
  static async setConsentFlowEnabled(enabled: boolean) {
    if (hasFn(CASMobileAdsModule, 'setConsentFlowEnabled')) {
      return CASMobileAdsModule.setConsentFlowEnabled(enabled);
    }
  }
  static addConsentFlowDismissedEventListener(
    listener: (status: number) => void
  ): () => void {
    const sub = eventEmitter.addListener('consentFlowDismissed', (status: number) =>
      listener(status)
    );
    return () => sub.remove();
  }


  static async getSettings(): Promise<CASSettings> {
    if (hasFn(CASMobileAdsModule, 'getSettings')) {
      return CASMobileAdsModule.getSettings();
    }
    return {} as CASSettings;
  }
  static async setSettings(settings: Partial<CASSettings>) {
    if (hasFn(CASMobileAdsModule, 'setSettings')) {
      return CASMobileAdsModule.setSettings(settings);
    }
  }
}
