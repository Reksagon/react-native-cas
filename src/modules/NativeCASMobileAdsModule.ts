import type { InitializationStatus, InitializationParams, Gender } from '../types/Types';
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {  
   initialize(casId: string, options: {
    audience?: number;
    showConsentFormIfRequired?: boolean;
    forceTestAds?: boolean;
    testDeviceIds?: string[];
    privacyGeography?: number;
    mediationExtras?: { [key: string]: string };
  } | null): Promise<InitializationStatus>;

  isInitialized(): Promise<boolean>;

  setUserAge(age: number): void;
  setUserGender(gender: number): void;
  setAppContentUrl(contentUrl?: string): void;
  setAppKeywords(keywords: string[]): void;
  setDebugLoggingEnabled(enabled: boolean): void;
  setAdSoundsMuted(muted: boolean): void;
  setLocationCollectionEnabled(enabled: boolean): void;
  setTrialAdFreeInterval(interval: number): void;

  isInterstitialAdLoaded(): Promise<boolean>;
  loadInterstitialAd(): void;
  showInterstitialAd(): void;
  setInterstitialAutoloadEnabled(enabled: boolean): void;
  setInterstitialAutoshowEnabled(enabled: boolean): void;
  setInterstitialMinInterval(seconds: number): void;
  restartInterstitialInterval(): void;
  destroyInterstitial(): void;

  isRewardedAdLoaded(): Promise<boolean>;
  loadRewardedAd(): void;
  showRewardedAd(): void;
  setRewardedAutoloadEnabled(enabled: boolean): void;
  destroyRewarded(): void;

  isAppOpenAdLoaded(): Promise<boolean>;
  loadAppOpenAd(): void;
  showAppOpenAd(): void;
  setAppOpenAutoloadEnabled(enabled: boolean): void;
  setAppOpenAutoshowEnabled(enabled: boolean): void;
  destroyAppOpen(): void;

  getSDKVersion(): Promise<string>;
  showConsentFlow(): void;

  addListener(eventType: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("CASMobileAds");