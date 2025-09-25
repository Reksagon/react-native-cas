import type { InitConfiguration, CASSettings } from '../types/Types';
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface CASSpec extends TurboModule {
  //Init
  initialize(casId: string, testMode: boolean): Promise<InitConfiguration>;
  isInitialized(): Promise<boolean>;

  //Mediation extras
  setMediationExtras(key: string, value: string): Promise<void>;

  //Adaptive banner helper
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

  //Misc
  getSDKVersion(): Promise<string>;
  setTestMode(enabled: boolean): void;

  //Consent flow
  showConsentFlow(): Promise<void>;
  setConsentFlowEnabled(enabled: boolean): void;

  //Settings
  getSettings(): Promise<CASSettings>;
  setSettings(settings: Partial<CASSettings>): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<CASSpec>('CASMobileAds');
