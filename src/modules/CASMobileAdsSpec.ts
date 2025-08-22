import type {
  BuildManagerParams,
  InitConfiguration,
  TargetingOptions,  
  CASSettings,  
  AdViewSize,
} from '../types/Types';
import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
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

  // Ad formats
  isInterstitialAdLoaded(): Promise<boolean>;
  loadInterstitialAd(): Promise<void>;
  showInterstitialAd(): Promise<void>;

  isRewardedAdLoaded(): Promise<boolean>;
  loadRewardedAd(): Promise<void>;
  showRewardedAd(): Promise<void>;

  isAppOpenAdLoaded(): Promise<boolean>;
  loadAppOpenAd(): Promise<void>;
  showAppOpenAd(): Promise<void>;

  // Additional Methods
  getSDKVersion(): Promise<string>;
  setTestMode(enabled: boolean): void;

  // Consent    
  showConsentFlow(): Promise<void>;
  setConsentFlowEnabled(enabled: boolean): Promise<void>;
  addConsentFlowDismissedEventListener(listener: (status: number) => void): () => Promise<void>;

  // Targeting
  getTargetingOptions(): Promise<TargetingOptions>;
  setTargetingOptions(options: Partial<TargetingOptions>): Promise<void>;

  // Settings
  getSettings(): Promise<CASSettings>;
  setSettings(settings: Partial<CASSettings>): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('CASMobileAds');
