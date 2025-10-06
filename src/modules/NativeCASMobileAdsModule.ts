import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
import type {Int32} from 'react-native/Libraries/Types/CodegenTypes';

export type InitializationStatus = {
  error?: string;
  countryCode?: string;
  isConsentRequired: boolean;
  consentFlowStatus: Int32;
};

export type InitializationParams = {
  targetAudience?: Int32;
  showConsentFormIfRequired?: boolean;
  forceTestAds?: boolean;
  testDeviceIds?: string[];
  debugPrivacyGeography?: Int32 | null;
  mediationExtras?: { [key: string]: string };
};

export interface Spec extends TurboModule {
  initialize(
    casId: string,
    options: InitializationParams | null,
  ): Promise<InitializationStatus>;
  isInitialized(): Promise<boolean>;

  //App/Targeting settings
  setUserAge(age: Int32): Promise<void>;
  setUserGender(gender: Int32): Promise<void>; 
  setAppContentUrl(contentUrl?: string): Promise<void>;
  setAppKeywords(keywords: string[]): Promise<void>;
  setDebugLoggingEnabled(enabled: boolean): Promise<void>;
  setAdSoundsMuted(muted: boolean): Promise<void>;
  setLocationCollectionEnabled(enabled: boolean): Promise<void>;
  setTrialAdFreeInterval(interval: Int32): Promise<void>;

  //Interstitial
  isInterstitialAdLoaded(): Promise<boolean>;
  loadInterstitialAd(): Promise<void>;
  showInterstitialAd(): Promise<void>;
  setInterstitialAutoloadEnabled(enabled: boolean): Promise<void>;
  setInterstitialAutoshowEnabled(enabled: boolean): Promise<void>;
  setInterstitialMinInterval(seconds: Int32): Promise<void>;
  restartInterstitialInterval(): Promise<void>;
  destroyInterstitial(): Promise<void>;

  //Rewarded
  isRewardedAdLoaded(): Promise<boolean>;
  loadRewardedAd(): Promise<void>;
  showRewardedAd(): Promise<void>;
  setRewardedAutoloadEnabled(enabled: boolean): Promise<void>;
  destroyRewarded(): Promise<void>;

  //App Open
  isAppOpenAdLoaded(): Promise<boolean>;
  loadAppOpenAd(): Promise<void>;
  showAppOpenAd(): Promise<void>;
  setAppOpenAutoloadEnabled(enabled: boolean): Promise<void>;
  setAppOpenAutoshowEnabled(enabled: boolean): Promise<void>;
  destroyAppOpen(): Promise<void>;

  //Misc
  getSDKVersion(): Promise<string>;
  showConsentFlow(): Promise<number>;

  addListener(eventName: string): void;    
  removeListeners(count: number): void;     
}

export default TurboModuleRegistry.getEnforcing<Spec>('CASMobileAds');
