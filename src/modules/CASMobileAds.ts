import type {
    BuildManagerParams,
    InitConfiguration,
    TargetingOptions,
    CASSettings,
    AdViewSize,
} from '../types/Types';
import { NativeModules, NativeEventEmitter } from 'react-native';
import type { CASMobileAdsSpec } from './CASMobileAdsSpec';

const { MediationManagerModule, CASMobileAdsModule } = NativeModules as {
    MediationManagerModule: any;
    CASMobileAdsModule: CASMobileAdsSpec;
};
const eventEmitter = new NativeEventEmitter(CASMobileAdsModule);

function hasFn(obj: any, name: string): boolean {
    return !!obj && typeof obj[name] === 'function';
}

const BANNER_FALLBACK_HEIGHT = 50;

export class CASMobileAds {
    static async initialize(params: BuildManagerParams): Promise<InitConfiguration> {
        if (hasFn(CASMobileAdsModule, 'initialize')) {
            return CASMobileAdsModule.initialize(params);
        }
        // if (hasFn(CASMobileAdsModule, 'buildManager')) {
        //     return CASMobileAdsModule.buildManager(params);
        // }
        throw new Error('CASMobileAds native module: initialize/buildManager not implemented');
    }

    static async isInitialized(): Promise<boolean> {
        if (hasFn(CASMobileAdsModule, 'isInitialized')) {
            return CASMobileAdsModule.isInitialized();
        }
        return true;
    }

    static async preloadNativeUIComponentAdView(
        adUnitId: string,
        adFormat: string,
        adViewSize: AdViewSize,
        placement: string | null = null,
        customData: string | null = null,
        extraParameters: Record<string, any> = {},
        localExtraParameters: Record<string, any> = {}
    ): Promise<number> {
        if (hasFn(CASMobileAdsModule, 'preloadNativeUIComponentAdView')) {
            return CASMobileAdsModule.preloadNativeUIComponentAdView(
                adUnitId,
                adFormat,
                adViewSize,
                placement,
                customData,
                extraParameters,
                localExtraParameters
            );
        }
        throw new Error('preloadNativeUIComponentAdView is not implemented on native side');
    }

    static async destroyNativeUIComponentAdView(adViewId: number): Promise<void> {
        if (hasFn(CASMobileAdsModule, 'destroyNativeUIComponentAdView')) {
            return CASMobileAdsModule.destroyNativeUIComponentAdView(adViewId);
        }
        throw new Error('destroyNativeUIComponentAdView is not implemented on native side');
    }

    static async getAdaptiveBannerHeightForWidth(width: number): Promise<number> {
        if (hasFn(CASMobileAdsModule, 'getAdaptiveBannerHeightForWidth')) {
            return CASMobileAdsModule.getAdaptiveBannerHeightForWidth(width);
        }
        return BANNER_FALLBACK_HEIGHT;
    }

    static isInterstitialAdLoaded(): Promise<boolean> {
        return hasFn(CASMobileAdsModule, 'isInterstitialAdLoaded')
            ? CASMobileAdsModule.isInterstitialAdLoaded()
            : MediationManagerModule.isInterstitialReady();
    }

    static loadInterstitialAd(): Promise<void> {
        return hasFn(CASMobileAdsModule, 'loadInterstitialAd')
            ? CASMobileAdsModule.loadInterstitialAd()
            : MediationManagerModule.loadInterstitial();
    }

    static showInterstitialAd(): Promise<void> {
        return hasFn(CASMobileAdsModule, 'showInterstitialAd')
            ? CASMobileAdsModule.showInterstitialAd()
            : MediationManagerModule.showInterstitial('global');
    }

    static isRewardedAdLoaded(): Promise<boolean> {
        return hasFn(CASMobileAdsModule, 'isRewardedAdLoaded')
            ? CASMobileAdsModule.isRewardedAdLoaded()
            : MediationManagerModule.isRewardedAdReady();
    }

    static loadRewardedAd(): Promise<void> {
        return hasFn(CASMobileAdsModule, 'loadRewardedAd')
            ? CASMobileAdsModule.loadRewardedAd()
            : MediationManagerModule.loadRewardedAd();
    }

    static showRewardedAd(): Promise<void> {
        return hasFn(CASMobileAdsModule, 'showRewardedAd')
            ? CASMobileAdsModule.showRewardedAd()
            : MediationManagerModule.showRewardedAd('global');
    }

    static isAppOpenAdLoaded(): Promise<boolean> {
        return hasFn(CASMobileAdsModule, 'isAppOpenAdLoaded')
            ? CASMobileAdsModule.isAppOpenAdLoaded()
            : MediationManagerModule.isAppOpenAdAvailable();
    }

    static loadAppOpenAd(isLandscape: boolean = true): Promise<void> {
        return hasFn(CASMobileAdsModule, 'loadAppOpenAd')
            ? CASMobileAdsModule.loadAppOpenAd(isLandscape)
            : MediationManagerModule.loadAppOpenAd(isLandscape);
    }

    static showAppOpenAd(): Promise<void> {
        return hasFn(CASMobileAdsModule, 'showAppOpenAd')
            ? CASMobileAdsModule.showAppOpenAd()
            : MediationManagerModule.showAppOpenAd('global');
    }

    static async getSDKVersion(): Promise<string> {
        return hasFn(CASMobileAdsModule, 'getSDKVersion') ? CASMobileAdsModule.getSDKVersion() : 'unknown';
    }

    static setTestMode(enabled: boolean) {
        if (hasFn(CASMobileAdsModule, 'setTestMode')) {
            CASMobileAdsModule.setTestMode(enabled);
        }
    }

    static async showConsentFlow() {
        if (hasFn(CASMobileAdsModule, 'showConsentFlow')) {
            return CASMobileAdsModule.showConsentFlow();
        }
    }

    static setConsentFlowEnabled(enabled: boolean) {
        if (hasFn(CASMobileAdsModule, 'setConsentFlowEnabled')) {
            CASMobileAdsModule.setConsentFlowEnabled(enabled);
        }
    }

    static addConsentFlowDismissedEventListener(listener: (status: number) => void): () => void {
        const sub = eventEmitter.addListener('consentFlowDismissed', listener);
        return () => sub.remove();
    }

    static async getTargetingOptions(): Promise<TargetingOptions> {
        return hasFn(CASMobileAdsModule, 'getTargetingOptions') ? CASMobileAdsModule.getTargetingOptions() : ({} as TargetingOptions);
    }

    static async setTargetingOptions(options: Partial<TargetingOptions>) {
        if (hasFn(CASMobileAdsModule, 'setTargetingOptions')) {
            return CASMobileAdsModule.setTargetingOptions(options);
        }
    }

    static async getSettings(): Promise<CASSettings> {
        return hasFn(CASMobileAdsModule, 'getSettings') ? CASMobileAdsModule.getSettings() : ({} as CASSettings);
    }

    static async setSettings(settings: Partial<CASSettings>) {
        if (hasFn(CASMobileAdsModule, 'setSettings')) {
            return CASMobileAdsModule.setSettings(settings);
        }
    }
}
