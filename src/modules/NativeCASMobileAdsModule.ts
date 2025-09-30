import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";
import type { InitConfiguration } from '../types/Types';

export interface Spec extends TurboModule {
  // Init
  initialize(casId: string, withConsentFlow: boolean, testMode: boolean): Promise<InitConfiguration>;
  isInitialized(): Promise<boolean>;

  // Extras / Misc / Settings  
  getSDKVersion(): Promise<string>;
  setTestMode(enabled: boolean): void;

  getSettings(): Promise<{
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
  }>;

  setSettings(settings: {
    taggedAudience?: number;
    age?: number;
    gender?: number;
    contentUrl?: string;
    keywords?: string[];
    debugMode?: boolean;
    mutedAdSounds?: boolean;
    testDeviceIDs?: string[];
    locationCollectionEnabled?: boolean;
    trialAdFreeInterval?: number;
  }): Promise<void>;

  showConsentFlow(): Promise<void>;
  setConsentFlowEnabled(enabled: boolean): void;

  setMediationExtras(key: string, value: string): Promise<void>;

  //Adaptive Banner
  getAdaptiveBannerHeightForWidth(width: number): Promise<number>;

  //Interstitial
  isInterstitialAdLoaded(): Promise<boolean>;
  loadInterstitialAd(): Promise<void>;
  showInterstitialAd(): Promise<void>;
  setInterstitialAutoloadEnabled(enabled: boolean): Promise<void>;
  setInterstitialAutoshowEnabled(enabled: boolean): Promise<void>;
  setInterstitialMinInterval(seconds: number): Promise<void>;
  restartInterstitialInterval(): Promise<void>;
  destroyInterstitial(): Promise<void>;

  //Rewarded
  isRewardedAdLoaded(): Promise<boolean>;
  loadRewardedAd(): Promise<void>;
  showRewardedAd(): Promise<void>;
  setRewardedAutoloadEnabled(enabled: boolean): Promise<void>;
  destroyRewarded(): Promise<void>;

  //AppOpen
  isAppOpenAdLoaded(): Promise<boolean>;
  loadAppOpenAd(): Promise<void>;
  showAppOpenAd(): Promise<void>;
  setAppOpenAutoloadEnabled(enabled: boolean): Promise<void>;
  setAppOpenAutoshowEnabled(enabled: boolean): Promise<void>;
  destroyAppOpen(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("CASMobileAds");