import { NativeModules, NativeEventEmitter } from 'react-native';
const { MediationManagerModule, CASMobileAdsModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(CASMobileAdsModule);
function hasFn(obj, name) {
    return !!obj && typeof obj[name] === 'function';
}
const BANNER_FALLBACK_HEIGHT = 50;
export class CASMobileAds {
    static async initialize(params) {
        if (hasFn(CASMobileAdsModule, 'initialize')) {
            return CASMobileAdsModule.initialize(params);
        }
        // if (hasFn(CASMobileAdsModule, 'buildManager')) {
        //     return CASMobileAdsModule.buildManager(params);
        // }
        throw new Error('CASMobileAds native module: initialize/buildManager not implemented');
    }
    static async isInitialized() {
        if (hasFn(CASMobileAdsModule, 'isInitialized')) {
            return CASMobileAdsModule.isInitialized();
        }
        return true;
    }
    static async preloadNativeUIComponentAdView(adUnitId, adFormat, adViewSize, placement = null, customData = null, extraParameters = {}, localExtraParameters = {}) {
        if (hasFn(CASMobileAdsModule, 'preloadNativeUIComponentAdView')) {
            return CASMobileAdsModule.preloadNativeUIComponentAdView(adUnitId, adFormat, adViewSize, placement, customData, extraParameters, localExtraParameters);
        }
        throw new Error('preloadNativeUIComponentAdView is not implemented on native side');
    }
    static async destroyNativeUIComponentAdView(adViewId) {
        if (hasFn(CASMobileAdsModule, 'destroyNativeUIComponentAdView')) {
            return CASMobileAdsModule.destroyNativeUIComponentAdView(adViewId);
        }
        throw new Error('destroyNativeUIComponentAdView is not implemented on native side');
    }
    static async getAdaptiveBannerHeightForWidth(width) {
        if (hasFn(CASMobileAdsModule, 'getAdaptiveBannerHeightForWidth')) {
            return CASMobileAdsModule.getAdaptiveBannerHeightForWidth(width);
        }
        return BANNER_FALLBACK_HEIGHT;
    }
    static isInterstitialAdLoaded() {
        return hasFn(CASMobileAdsModule, 'isInterstitialAdLoaded')
            ? CASMobileAdsModule.isInterstitialAdLoaded()
            : MediationManagerModule.isInterstitialReady();
    }
    static loadInterstitialAd() {
        return hasFn(CASMobileAdsModule, 'loadInterstitialAd')
            ? CASMobileAdsModule.loadInterstitialAd()
            : MediationManagerModule.loadInterstitial();
    }
    static showInterstitialAd() {
        return hasFn(CASMobileAdsModule, 'showInterstitialAd')
            ? CASMobileAdsModule.showInterstitialAd()
            : MediationManagerModule.showInterstitial('global');
    }
    static isRewardedAdLoaded() {
        return hasFn(CASMobileAdsModule, 'isRewardedAdLoaded')
            ? CASMobileAdsModule.isRewardedAdLoaded()
            : MediationManagerModule.isRewardedAdReady();
    }
    static loadRewardedAd() {
        return hasFn(CASMobileAdsModule, 'loadRewardedAd')
            ? CASMobileAdsModule.loadRewardedAd()
            : MediationManagerModule.loadRewardedAd();
    }
    static showRewardedAd() {
        return hasFn(CASMobileAdsModule, 'showRewardedAd')
            ? CASMobileAdsModule.showRewardedAd()
            : MediationManagerModule.showRewardedAd('global');
    }
    static isAppOpenAdLoaded() {
        return hasFn(CASMobileAdsModule, 'isAppOpenAdLoaded')
            ? CASMobileAdsModule.isAppOpenAdLoaded()
            : MediationManagerModule.isAppOpenAdAvailable();
    }
    static loadAppOpenAd(isLandscape = true) {
        return hasFn(CASMobileAdsModule, 'loadAppOpenAd')
            ? CASMobileAdsModule.loadAppOpenAd(isLandscape)
            : MediationManagerModule.loadAppOpenAd(isLandscape);
    }
    static showAppOpenAd() {
        return hasFn(CASMobileAdsModule, 'showAppOpenAd')
            ? CASMobileAdsModule.showAppOpenAd()
            : MediationManagerModule.showAppOpenAd('global');
    }
    static async getSDKVersion() {
        return hasFn(CASMobileAdsModule, 'getSDKVersion') ? CASMobileAdsModule.getSDKVersion() : 'unknown';
    }
    static setTestMode(enabled) {
        if (hasFn(CASMobileAdsModule, 'setTestMode')) {
            CASMobileAdsModule.setTestMode(enabled);
        }
    }
    static async showConsentFlow() {
        if (hasFn(CASMobileAdsModule, 'showConsentFlow')) {
            return CASMobileAdsModule.showConsentFlow();
        }
    }
    static setConsentFlowEnabled(enabled) {
        if (hasFn(CASMobileAdsModule, 'setConsentFlowEnabled')) {
            CASMobileAdsModule.setConsentFlowEnabled(enabled);
        }
    }
    static addConsentFlowDismissedEventListener(listener) {
        const sub = eventEmitter.addListener('consentFlowDismissed', listener);
        return () => sub.remove();
    }
    static async getTargetingOptions() {
        return hasFn(CASMobileAdsModule, 'getTargetingOptions') ? CASMobileAdsModule.getTargetingOptions() : {};
    }
    static async setTargetingOptions(options) {
        if (hasFn(CASMobileAdsModule, 'setTargetingOptions')) {
            return CASMobileAdsModule.setTargetingOptions(options);
        }
    }
    static async getSettings() {
        return hasFn(CASMobileAdsModule, 'getSettings') ? CASMobileAdsModule.getSettings() : {};
    }
    static async setSettings(settings) {
        if (hasFn(CASMobileAdsModule, 'setSettings')) {
            return CASMobileAdsModule.setSettings(settings);
        }
    }
}
