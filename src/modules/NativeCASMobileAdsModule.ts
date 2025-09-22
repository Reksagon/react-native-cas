import type {
  BuildManagerParams,
  InitConfiguration,
  CASSettings,
  Audience,
  Gender,
} from '../types/Types';
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {

  /**
   * Returns all supported event constants and SDK error codes.
   */
  readonly getConstants: () => {

  };

  // Init
  initialize(params: {
  casId?: string;
  testMode?: boolean;
}): Promise<InitConfiguration>;
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

  // Consent flow
  showConsentFlow(): Promise<void>;
  setConsentFlowEnabled(enabled: boolean): void;

  // Settings
  getSettings(): Promise<CASSettings>;
  setSettings(settings: {
    taggedAudience: number;
    age: number;
    gender: number;
    contentUrl?: string;
    keywords: string[];
    debugMode: boolean;
    mutedAdSounds: boolean;
    testDeviceIDs: string[];
    locationCollectionEnabled?: boolean;
    trialAdFreeInterval?: number;
  }): Promise<void>;
}

// export default null as any;
export default TurboModuleRegistry.getEnforcing<Spec>('CASMobileAds');
