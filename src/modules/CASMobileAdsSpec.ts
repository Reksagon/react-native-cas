import type {
  BuildManagerParams,
  InitConfiguration,
  TargetingOptions,
  CASSettings,
  AdViewSize,
} from '../types/Types';
import type { TurboModule } from 'react-native';

export interface CASSpec extends TurboModule {
  // Init
  initialize(params: BuildManagerParams): Promise<InitConfiguration>;
  isInitialized(): Promise<boolean>;

  // Preload / Destroy AdViews
  preloadNativeUIComponentAdView(
    adUnitId: string,
    adFormat: string,
    adViewSize: AdViewSize,
    placement?: string | null,
    customData?: string | null,
    extraParameters?: Record<string, any>,
    localExtraParameters?: Record<string, any>
  ): Promise<number>;

  destroyNativeUIComponentAdView(adViewId: number): Promise<void>;

  getAdaptiveBannerHeightForWidth(width: number): Promise<number>;

  // Interstitial
  isInterstitialAdLoaded(): Promise<boolean>;
  loadInterstitialAd(): Promise<void>;
  showInterstitialAd(): Promise<void>;

  // Rewarded
  isRewardedAdLoaded(): Promise<boolean>;
  loadRewardedAd(): Promise<void>;
  showRewardedAd(): Promise<void>;

  // AppOpen
  isAppOpenAdLoaded(): Promise<boolean>;
  loadAppOpenAd(isLandscape?: boolean): Promise<void>;
  showAppOpenAd(): Promise<void>;

  // Misc
  getSDKVersion(): Promise<string>;
  setTestMode(enabled: boolean): void;

  // Consent flow
  showConsentFlow(): Promise<void>;
  setConsentFlowEnabled(enabled: boolean): void;

  // Targeting / Settings
  getTargetingOptions(): Promise<TargetingOptions>;
  setTargetingOptions(options: Partial<TargetingOptions>): Promise<void>;

  getSettings(): Promise<CASSettings>;
  setSettings(settings: Partial<CASSettings>): Promise<void>;
}