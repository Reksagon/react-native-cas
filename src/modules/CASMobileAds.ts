import type {
    BuildManagerParams,
    InitConfiguration,
    TargetingOptions,
    CASSettings,
} from '../utils/types';
import CASMobileAdsModule from './CASMobileAdsSpec';
import { NativeEventEmitter } from 'react-native';

const eventEmitter = new NativeEventEmitter(CASMobileAdsModule);

export class CASMobileAds {
    // Init
    static async initialize(
        params: BuildManagerParams
    ): Promise<InitConfiguration> {
        return CASMobileAdsModule.buildManager(params);
    }

    // Ad Formats    
    static isInterstitialAdLoaded() {
        return CASMobileAdsModule.isInterstitialAdLoaded();
    }
    static loadInterstitialAd() {
        return CASMobileAdsModule.loadInterstitialAd();
    }
    static showInterstitialAd() {
        return CASMobileAdsModule.showInterstitialAd();
    }

    static isRewardedAdLoaded() {
        return CASMobileAdsModule.isRewardedAdLoaded();
    }
    static loadRewardedAd() {
        return CASMobileAdsModule.loadRewardedAd();
    }
    static showRewardedAd() {
        return CASMobileAdsModule.showRewardedAd();
    }

    static isAppOpenAdLoaded() {
        return CASMobileAdsModule.isAppOpenAdLoaded();
    }
    static loadAppOpenAd() {
        return CASMobileAdsModule.loadAppOpenAd();
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
    static async getSDKVersion(): Promise<string> {
        return CASMobileAdsModule.getSDKVersion();
    }

    static setTestMode(enabled: boolean) {
        CASMobileAdsModule.setTestMode(enabled);
    }

    // Consent Flow
    static async showConsentFlow() {
        return CASMobileAdsModule.showConsentFlow();
    }

    static async setConsentFlowEnabled(enabled: boolean) {
        CASMobileAdsModule.setConsentFlowEnabled(enabled);
    }

    static addConsentFlowDismissedEventListener(listener: (status: number) => void): () => void {
        const sub = eventEmitter.addListener('consentFlowDismissed', (status) =>
            listener(status)
        );
        return () => sub.remove();
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
}
