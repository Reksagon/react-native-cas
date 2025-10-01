import type { InitializationStatus, InitializationParams, Gender } from '../types/Types';
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface CASSpec extends TurboModule {
  initialize(casId: string, options: InitializationParams | null): Promise<InitializationStatus>;
  isInitialized(): Promise<boolean>;

  setUserAge(age: number): Promise<void>;
  setUserGender(gender: Gender): Promise<void>;
  setAppContentUrl(contentUrl?: string): Promise<void>;
  setAppKeywords(keywords: string[]): Promise<void>;
  setDebugLoggingEnabled(enabled: boolean): Promise<void>;
  setAdSoundsMuted(muted: boolean): Promise<void>;
  setLocationCollectionEnabled(enabled: boolean): Promise<void>;
  setTrialAdFreeInterval(interval: number): Promise<void>;

  isInterstitialAdLoaded(): Promise<boolean>;
  loadInterstitialAd(): Promise<void>;
  showInterstitialAd(): Promise<void>;
  setInterstitialAutoloadEnabled(enabled: boolean): Promise<void>;
  setInterstitialAutoshowEnabled(enabled: boolean): Promise<void>;
  setInterstitialMinInterval(seconds: number): Promise<void>;
  restartInterstitialInterval(): Promise<void>;
  destroyInterstitial(): Promise<void>;

  isRewardedAdLoaded(): Promise<boolean>;
  loadRewardedAd(): Promise<void>;
  showRewardedAd(): Promise<void>;
  setRewardedAutoloadEnabled(enabled: boolean): Promise<void>;
  destroyRewarded(): Promise<void>;

  isAppOpenAdLoaded(): Promise<boolean>;
  loadAppOpenAd(): Promise<void>;
  showAppOpenAd(): Promise<void>;
  setAppOpenAutoloadEnabled(enabled: boolean): Promise<void>;
  setAppOpenAutoshowEnabled(enabled: boolean): Promise<void>;
  destroyAppOpen(): Promise<void>;

  getSDKVersion(): Promise<string>;
  showConsentFlow(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<CASSpec>('CASMobileAds');
