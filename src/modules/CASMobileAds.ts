import CASMobileAdsNative from "./NativeCASMobileAdsModule";
import type { InitializationStatus, InitializationParams, Gender } from '../types/Types';

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

    if (options.privacyGeography != null) {
      payload.privacyGeography = options.privacyGeography as number;
    }
    if (Array.isArray(options.testDeviceIds)) payload.testDeviceIds = options.testDeviceIds;
    if (options.mediationExtras != null) payload.mediationExtras = options.mediationExtras;

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

  static showConsentFlow(): Promise<number> { return CASMobileAdsNative.showConsentFlow(); }

  static getSDKVersion() { return CASMobileAdsNative.getSDKVersion(); }

  static setDebugLoggingEnabled(enabled: boolean): void {
    CASMobileAdsNative.setDebugLoggingEnabled(enabled);
  }
  static setAdSoundsMuted(muted: boolean): void {
    CASMobileAdsNative.setAdSoundsMuted(muted);
  }
  static setUserAge(age: number): void {
    CASMobileAdsNative.setUserAge(age as any);
  }
  static setUserGender(gender: number): void {
    CASMobileAdsNative.setUserGender(gender as any);
  }
  static setAppContentUrl(contentUrl?: string): void {
    CASMobileAdsNative.setAppContentUrl(contentUrl);
  }
  static setAppKeywords(keywords: string[]): void {
    CASMobileAdsNative.setAppKeywords(keywords);
  }
  static setLocationCollectionEnabled(enabled: boolean): void {
    CASMobileAdsNative.setLocationCollectionEnabled(enabled);
  }
  static setTrialAdFreeInterval(interval: number): void {
    CASMobileAdsNative.setTrialAdFreeInterval(interval as any);
  }

  // Interstitial
  static isInterstitialAdLoaded(): Promise<boolean> {
    return CASMobileAdsNative.isInterstitialAdLoaded();
  }
  static loadInterstitialAd(): void {
    CASMobileAdsNative.loadInterstitialAd();
  }
  static showInterstitialAd(): void {
    CASMobileAdsNative.showInterstitialAd();
  }
  static setInterstitialAutoloadEnabled(enabled: boolean): void {
    CASMobileAdsNative.setInterstitialAutoloadEnabled(enabled);
  }
  static setInterstitialAutoshowEnabled(enabled: boolean): void {
    CASMobileAdsNative.setInterstitialAutoshowEnabled(enabled);
  }
  static setInterstitialMinInterval(seconds: number): void {
    CASMobileAdsNative.setInterstitialMinInterval(seconds as any);
  }
  static restartInterstitialInterval(): void {
    CASMobileAdsNative.restartInterstitialInterval();
  }
  static destroyInterstitial(): void {
    CASMobileAdsNative.destroyInterstitial();
  }

  // Rewarded
  static isRewardedAdLoaded(): Promise<boolean> {
    return CASMobileAdsNative.isRewardedAdLoaded();
  }
  static loadRewardedAd(): void {
    CASMobileAdsNative.loadRewardedAd();
  }
  static showRewardedAd(): void {
    CASMobileAdsNative.showRewardedAd();
  }
  static setRewardedAutoloadEnabled(enabled: boolean): void {
    CASMobileAdsNative.setRewardedAutoloadEnabled(enabled);
  }
  static destroyRewarded(): void {
    CASMobileAdsNative.destroyRewarded();
  }

  // App Open
  static isAppOpenAdLoaded(): Promise<boolean> {
    return CASMobileAdsNative.isAppOpenAdLoaded();
  }
  static loadAppOpenAd(): void {
    CASMobileAdsNative.loadAppOpenAd();
  }
  static showAppOpenAd(): void {
    CASMobileAdsNative.showAppOpenAd();
  }
  static setAppOpenAutoloadEnabled(enabled: boolean): void {
    CASMobileAdsNative.setAppOpenAutoloadEnabled(enabled);
  }
  static setAppOpenAutoshowEnabled(enabled: boolean): void {
    CASMobileAdsNative.setAppOpenAutoshowEnabled(enabled);
  }
  static destroyAppOpen(): void {
    CASMobileAdsNative.destroyAppOpen();
  }
}
