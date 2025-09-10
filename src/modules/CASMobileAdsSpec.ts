import type {
  BuildManagerParams,
  InitConfiguration,
  CASSettings,
} from '../types/Types';
import type { TurboModule } from 'react-native';

export interface CASSpec extends TurboModule {
  // Init
  initialize(params: BuildManagerParams): Promise<InitConfiguration>;
  isInitialized(): Promise<boolean>;

  // Adaptive banner helper
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
  loadAppOpenAd(): Promise<void>;
  showAppOpenAd(): Promise<void>;

  // Misc
  getSDKVersion(): Promise<string>;
  setTestMode(enabled: boolean): void;

  // Consent flow
  showConsentFlow(): Promise<void>;
  setConsentFlowEnabled(enabled: boolean): void;

  // Settings
  getSettings(): Promise<CASSettings>;
  setSettings(settings: Partial<CASSettings>): Promise<void>;
}

export default null as any;
