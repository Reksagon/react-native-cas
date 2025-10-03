import CASMobileAdsNative from "./NativeCASMobileAdsModule";
import { NativeModules, NativeEventEmitter } from 'react-native';
import type { InitializationStatus, InitializationParams, PrivacyGeography } from '../types/Types';

export const eventEmitter = new NativeEventEmitter(NativeModules.CASMobileAds);

export class CASMobileAds {

  /** 
  * Initializes the CAS Mobile Ads SDK.
  *
  * Call this method as early as possible after the app launches to reduce
  * latency on the session's first ad load.
  *
  * If this method is not called, the first ad load automatically
  * initializes the CAS Mobile Ads SDK with CAS Id defined in ad load arguments.
  *
  * **Note:** This [Promise] may take an unexpectedly long time to complete,
  * as it will only resolve once the SDK has either successfully initialized
  * or failed with a error.
  *
  * If an error occurs, the SDK will attempt automatic reinitialization internally.
  * However, this [Promise] will not be updated with subsequent [InitializationStatus].
  *
  * For the most up-to-date [InitializationStatus], call this method again at a later time.
  *
  * @param casId
  * The unique identifier for the CAS content.
  * Use `demo` value to force test ads mode for all devices.
  *
  * @param targetAudience
  * Indicates the target [Audience] of the app for regulatory and content purposes.
  * This may affect how the SDK handles data collection, personalization,
  * and content rendering, especially for audiences such as children.
  *
  * @param showConsentFormIfRequired
  * Shows the consent form only if it is required and the user has not responded previously.
  * If the consent status is required, the SDK loads a form and immediately presents it.
  *
  * @param forceTestAds
  * Enable test ads mode that will always return test ads for all devices.
  * **Attention** Don't forget to set it to False after the tests are completed.
  *
  * @param testDeviceIds
  * Add a test device ID corresponding to test devices which will always request test ads.
  * List of test devices should be defined before first MediationManager initialized.
  *
  * 1. Run an app with the CAS SDK initialize() call.
  * 2. Check the console or logcat output for a message that looks like this:
  * "To get test ads on this device, set ... "
  * 3. Copy your alphanumeric test device ID to your clipboard.
  * 4. Add the test device ID to the [testDeviceIds] list.
  *
  * @param privacyGeography
  * Sets the debug geography for testing purposes.
  * 
  *
  * @param mediationExtras
  * Mediation extra parameters.
  */
  static initialize(
    casId: string,
    options: InitializationParams = {}
  ): Promise<InitializationStatus> {
    if (typeof casId !== 'string') {
      return Promise.reject(
        new Error('initialize(casId, options?): casId must be a string')
      );
    }

    const payload: any = {};
    if (options.targetAudience != null) {
      payload.audience = options.targetAudience as number; 
    }
    
    if (options.showConsentFormIfRequired !== undefined)
      payload.showConsentFormIfRequired = options.showConsentFormIfRequired;
    if (options.forceTestAds !== undefined) payload.forceTestAds = options.forceTestAds;
    if (Array.isArray(options.testDeviceIds)) payload.testDeviceIds = options.testDeviceIds;      
    if (options.mediationExtras != null)
      payload.mediationExtras = options.mediationExtras;

    if (options.privacyGeography != null) {      
      payload.privacyGeography = options.privacyGeography as number;
    }

    return CASMobileAdsNative.initialize(
      casId,
      Object.keys(payload).length ? payload : null
    );
  }


  /**
   * Is SDK initialized.
   */
  static isInitialized(): Promise<boolean> {
    return CASMobileAdsNative.isInitialized();
  }

  static showConsentFlow() { return CASMobileAdsNative.showConsentFlow(); }
  static addConsentFlowDismissedEventListener(listener: (status: number) => void) {
    const sub = eventEmitter.addListener('consentFlowDismissed', (e: any) => {
      listener(typeof e?.status === 'number' ? e.status : -1);
    });
    return () => sub.remove();
  }

  static getSDKVersion() { return CASMobileAdsNative.getSDKVersion(); }

  static setDebugLoggingEnabled(enabled: boolean): Promise<void> {
    return CASMobileAdsNative.setDebugLoggingEnabled(enabled);
  }
  static setAdSoundsMuted(muted: boolean): Promise<void> {
    return CASMobileAdsNative.setAdSoundsMuted(muted);
  }
  static setUserAge(age: number): Promise<void> {
    return CASMobileAdsNative.setUserAge(age);
  }
  static setUserGender(gender: number): Promise<void> {
    return CASMobileAdsNative.setUserGender(gender);
  }
  static setAppContentUrl(contentUrl?: string): Promise<void> {
    return CASMobileAdsNative.setAppContentUrl(contentUrl);
  }
  static setAppKeywords(keywords: string[]): Promise<void> {
    return CASMobileAdsNative.setAppKeywords(keywords);
  }
  static setLocationCollectionEnabled(enabled: boolean): Promise<void> {
    return CASMobileAdsNative.setLocationCollectionEnabled(enabled);
  }
  static setTrialAdFreeInterval(interval: number): Promise<void> {
    return CASMobileAdsNative.setTrialAdFreeInterval(interval);
  }

  static isInterstitialAdLoaded() { return CASMobileAdsNative.isInterstitialAdLoaded(); }
  static loadInterstitialAd() { return CASMobileAdsNative.loadInterstitialAd(); }
  static showInterstitialAd() { return CASMobileAdsNative.showInterstitialAd(); }
  static setInterstitialAutoloadEnabled(enabled: boolean) { return CASMobileAdsNative.setInterstitialAutoloadEnabled(enabled); }
  static setInterstitialAutoshowEnabled(enabled: boolean) { return CASMobileAdsNative.setInterstitialAutoshowEnabled(enabled); }
  static setInterstitialMinInterval(seconds: number) { return CASMobileAdsNative.setInterstitialMinInterval(seconds); }
  static restartInterstitialInterval() { return CASMobileAdsNative.restartInterstitialInterval(); }
  static destroyInterstitial() { return CASMobileAdsNative.destroyInterstitial(); }

  static isRewardedAdLoaded() { return CASMobileAdsNative.isRewardedAdLoaded(); }
  static loadRewardedAd() { return CASMobileAdsNative.loadRewardedAd(); }
  static showRewardedAd() { return CASMobileAdsNative.showRewardedAd(); }
  static setRewardedAutoloadEnabled(enabled: boolean) { return CASMobileAdsNative.setRewardedAutoloadEnabled(enabled); }
  static destroyRewarded() { return CASMobileAdsNative.destroyRewarded(); }

  static isAppOpenAdLoaded() { return CASMobileAdsNative.isAppOpenAdLoaded(); }
  static loadAppOpenAd() { return CASMobileAdsNative.loadAppOpenAd(); }
  static showAppOpenAd() { return CASMobileAdsNative.showAppOpenAd(); }
  static setAppOpenAutoloadEnabled(enabled: boolean) { return CASMobileAdsNative.setAppOpenAutoloadEnabled(enabled); }
  static setAppOpenAutoshowEnabled(enabled: boolean) { return CASMobileAdsNative.setAppOpenAutoshowEnabled(enabled); }
  static destroyAppOpen() { return CASMobileAdsNative.destroyAppOpen(); }
}
