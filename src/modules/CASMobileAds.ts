import type {
    BuildManagerParams,
    BuildManagerResult,
    TargetingOptions,
    AudienceNetworkDataProcessingOptions,
    CASSettings,
    ConsentFlowParams,
} from '../utils/types';
import CASMobileAdsModule from './CASMobileAdsSpec';
import { Platform } from 'react-native';

export class CASMobileAds {
    // Init
    static async initialize(sdkKey: string) {
        return CASMobileAdsModule.initialize(sdkKey);
    }
    static async getSDKVersion(): Promise<string> {
        return CASMobileAdsModule.getSDKVersion();
    }

    // Build Manager
    static async buildManager(
        params: BuildManagerParams
    ): Promise<BuildManagerResult> {
        return CASMobileAdsModule.buildManager(params);
    }

    // Ad Formats    
    static isInterstitialReady() {
        return CASMobileAdsModule.isInterstitialReady();
    }
    static loadInterstitial() {
        return CASMobileAdsModule.loadInterstitial();
    }
    static showInterstitial() {
        return CASMobileAdsModule.showInterstitial();
    }

    static isRewardedReady() {
        return CASMobileAdsModule.isRewardedReady();
    }
    static loadRewarded() {
        return CASMobileAdsModule.loadRewarded();
    }
    static showRewarded() {
        return CASMobileAdsModule.showRewarded();
    }

    static isAppOpenAdAvailable() {
        return CASMobileAdsModule.isAppOpenAdAvailable();
    }
    static loadAppOpenAd(isLandscape?: boolean) {
        return CASMobileAdsModule.loadAppOpenAd(isLandscape ?? false);
    }
    static showAppOpenAd() {
        return CASMobileAdsModule.showAppOpenAd();
    }

    static loadBanner(size: string, adaptive = false) {
        return CASMobileAdsModule.loadBanner(size, adaptive);
    }
    static destroyBanner() {
        return CASMobileAdsModule.destroyBanner();
    }

    // Additional Methods
    static setTestMode(enabled: boolean) {
        CASMobileAdsModule.setTestMode(enabled);
    }
    static async showConsentFlow(params: Omit<ConsentFlowParams, 'enabled'>) {
        return CASMobileAdsModule.showConsentFlow(params);
    }

    static async getTargetingOptions(): Promise<TargetingOptions> {
        return CASMobileAdsModule.getTargetingOptions();
    }

    static async setTargetingOptions(options: Partial<TargetingOptions>) {
        return CASMobileAdsModule.setTargetingOptions(options);
    }

    static async getSettings(): Promise<CASSettings> {
        return CASMobileAdsModule.getSettings();
    }

    static async setSettings(settings: Partial<CASSettings>) {
        return CASMobileAdsModule.setSettings(settings);
    }

    static async debugValidateIntegration() {
        return CASMobileAdsModule.debugValidateIntegration();
    }

    static async restartInterstitialInterval() {
        return CASMobileAdsModule.restartInterstitialInterval();
    }

    static async setAudienceNetworkDataProcessingOptions(
        params: AudienceNetworkDataProcessingOptions
    ) {
        return CASMobileAdsModule.setAudienceNetworkDataProcessingOptions(params);
    }

    static async setAdvertiserTrackingEnabled(enable: boolean) {
        if (Platform.OS === 'ios') {
            return CASMobileAdsModule.setAdvertiserTrackingEnabled(enable);
        }
    }

    static async setGoogleAdsConsentForCookies(enabled: boolean) {
        if (Platform.OS === 'android') {
            return CASMobileAdsModule.setGoogleAdsConsentForCookies(enabled);
        }
    }
}
