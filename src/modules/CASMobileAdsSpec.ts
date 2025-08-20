import type {
  BuildManagerParams,
  BuildManagerResult,
  TargetingOptions,
  AudienceNetworkDataProcessingOptions,
  CASSettings,  
  ConsentFlowParams,
} from '../utils/types';
import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    // Init
    initialize(sdkKey: string): Promise<void>;
    getSDKVersion(): Promise<string>;

    // Build Manager
    buildManager(params: BuildManagerParams): Promise<BuildManagerResult>;

    // Ad formats
    isInterstitialReady(): Promise<boolean>;
    loadInterstitial(): Promise<void>;
    showInterstitial(): Promise<void>;

    isRewardedReady(): Promise<boolean>;
    loadRewarded(): Promise<void>;
    showRewarded(): Promise<void>;

    isAppOpenAdAvailable(): Promise<boolean>;
    loadAppOpenAd(isLandscape?: boolean): Promise<void>;
    showAppOpenAd(): Promise<void>;

    loadBanner(size: string, adaptive: boolean): Promise<void>;
    destroyBanner(): Promise<void>;

    // Additional Methods
    setTestMode(enabled: boolean): void;

    // Consent    
    showConsentFlow(params: ConsentFlowParams): Promise<void>;

    // Facebook
    setAudienceNetworkDataProcessingOptions(params: AudienceNetworkDataProcessingOptions): Promise<void>;
    setAdvertiserTrackingEnabled(enable: boolean): Promise<void>;

    // Google
    setGoogleAdsConsentForCookies(enabled: boolean): Promise<void>;

    // Targeting
    getTargetingOptions(): Promise<TargetingOptions>;
    setTargetingOptions(options: Partial<TargetingOptions>): Promise<void>;

    // Settings
    getSettings(): Promise<CASSettings>;
    setSettings(settings: Partial<CASSettings>): Promise<void>;

    // Debug
    debugValidateIntegration(): Promise<void>;
    restartInterstitialInterval(): Promise<void>;    
}

export default TurboModuleRegistry.getEnforcing<Spec>('CASMobileAds');
