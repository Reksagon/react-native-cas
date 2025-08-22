import type {
  BuildManagerParams,
  InitConfiguration,
  TargetingOptions,
  CASSettings,
} from '../types/Types';
import CASMobileAdsModule from './CASMobileAdsSpec';
import { NativeEventEmitter } from 'react-native';
import { AdViewSize } from '../types/Types'


const eventEmitter = new NativeEventEmitter(CASMobileAdsModule);

export class CASMobileAds {
  // Init
  static async initialize(
    params: BuildManagerParams
  ): Promise<InitConfiguration> {
    return CASMobileAdsModule.buildManager(params);
  }

  static async isInitialized(): Promise<boolean> {
    return CASMobileAdsModule.isInitialized();
  }

  // Preload / Destroy AdViews
  static async preloadNativeUIComponentAdView(
    adUnitId: string,
    adFormat: string,
    adViewSize: AdViewSize,
    placement: string | null = null,
    customData: string | null = null,
    extraParameters: Record<string, any> = {},
    localExtraParameters: Record<string, any> = {}
  ): Promise<number> {
    return CASMobileAdsModule.preloadNativeUIComponentAdView(
      adUnitId,
      adFormat,
      adViewSize,
      placement,
      customData,
      extraParameters,
      localExtraParameters
    );
  }

  static async destroyNativeUIComponentAdView(adViewId: number): Promise<void> {
    return CASMobileAdsModule.destroyNativeUIComponentAdView(adViewId);
  }

  static async getAdaptiveBannerHeightForWidth(width: number): Promise<number> {
    return CASMobileAdsModule.getAdaptiveBannerHeightForWidth(width);
  }

  // Ad Formats    
  static isInterstitialAdLoaded() {
    return CASMobileAdsModule.isInterstitialAdLoaded();
  }
  static loadInterstitialAd() {
    return CASMobileAdsModule.loadInterstitialAd();
  }
  static showInterstitialAd() {
    return CASMobileAdsModule.showInterstitialAd();
  }

  static isRewardedAdLoaded() {
    return CASMobileAdsModule.isRewardedAdLoaded();
  }
  static loadRewardedAd() {
    return CASMobileAdsModule.loadRewardedAd();
  }
  static showRewardedAd() {
    return CASMobileAdsModule.showRewardedAd();
  }

  static isAppOpenAdLoaded() {
    return CASMobileAdsModule.isAppOpenAdLoaded();
  }
  static loadAppOpenAd() {
    return CASMobileAdsModule.loadAppOpenAd();
  }
  static showAppOpenAd() {
    return CASMobileAdsModule.showAppOpenAd();
  }


  // Additional Methods
  static async getSDKVersion(): Promise<string> {
    return CASMobileAdsModule.getSDKVersion();
  }

  static setTestMode(enabled: boolean) {
    CASMobileAdsModule.setTestMode(enabled);
  }

  // Consent Flow
  static async showConsentFlow() {
    return CASMobileAdsModule.showConsentFlow();
  }

  static async setConsentFlowEnabled(enabled: boolean) {
    CASMobileAdsModule.setConsentFlowEnabled(enabled);
  }

  static addConsentFlowDismissedEventListener(listener: (status: number) => void): () => void {
    const sub = eventEmitter.addListener('consentFlowDismissed', (status) =>
      listener(status)
    );
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
}
