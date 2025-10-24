import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import type { InitializationStatus } from '../types/Initialization';

export interface Spec extends TurboModule {
  // SDK
  initialize(
    casId: string,
    options: {
      reactNativeVersion: string;
      targetAudience?: Int32;
      showConsentFormIfRequired: boolean;
      forceTestAds: boolean;
      testDeviceIds?: string[];
      debugGeography?: Int32;
      mediationExtras?: { [key: string]: string };
    },
  ): Promise<InitializationStatus>;
  isInitialized(): Promise<boolean>;
  getSDKVersion(): Promise<string>;
  showConsentFlow(): Promise<number>;

  // App/Targeting
  setUserAge(age: Int32): void;
  setUserGender(gender: Int32): void;
  setAppContentUrl(contentUrl?: string): void;
  setAppKeywords(keywords: string[]): void;
  setDebugLoggingEnabled(enabled: boolean): void;
  setAdSoundsMuted(muted: boolean): void;
  setLocationCollectionEnabled(enabled: boolean): void;
  setTrialAdFreeInterval(interval: Int32): void;

  // Interstitial
  isInterstitialAdLoaded(): Promise<boolean>;
  loadInterstitialAd(): void;
  showInterstitialAd(): void;
  setInterstitialAutoloadEnabled(enabled: boolean): void;
  setInterstitialAutoshowEnabled(enabled: boolean): void;
  setInterstitialMinInterval(seconds: Int32): void;
  restartInterstitialInterval(): void;
  destroyInterstitial(): void;

  // Rewarded
  isRewardedAdLoaded(): Promise<boolean>;
  loadRewardedAd(): void;
  showRewardedAd(): void;
  setRewardedAutoloadEnabled(enabled: boolean): void;
  destroyRewarded(): void;

  // App Open
  isAppOpenAdLoaded(): Promise<boolean>;
  loadAppOpenAd(): void;
  showAppOpenAd(): void;
  setAppOpenAutoloadEnabled(enabled: boolean): void;
  setAppOpenAutoshowEnabled(enabled: boolean): void;
  destroyAppOpen(): void;

  // EventEmitter bridge
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('CASMobileAds');
