import type {
  BuildManagerParams,
  InitConfiguration,
  TargetingOptions,  
  CASSettings,  
} from '../utils/types';
import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    // Init
    initialize(params: BuildManagerParams): Promise<InitConfiguration>;    

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

    loadBanner(size: string, adaptive: boolean): Promise<void>;
    destroyBanner(): Promise<void>;

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
