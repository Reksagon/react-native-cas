import type { InitConfiguration, CASSettings, InitOptions } from '../types/Types';
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface CASSpec extends TurboModule {
  initialize(casId: string, options: InitOptions | null): Promise<InitConfiguration>;
  isInitialized(): Promise<boolean>;

  setMediationExtras(key: string, value: string): Promise<void>;

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
  setTestMode(enabled: boolean): void;
  showConsentFlow(): Promise<void>;
  setConsentFlowEnabled(enabled: boolean): void;
  getSettings(): Promise<CASSettings>;
  setSettings(settings: Partial<CASSettings>): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<CASSpec>('CASMobileAds');
