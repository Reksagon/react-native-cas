import CASMobileAdsNative from "./modules/NativeCASMobileAdsModule";
import type { InitializationStatus, InitializationParams, Gender } from './types/Types';
import { version as reactNativeVersion } from 'react-native/Libraries/Core/ReactNativeVersion';

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
  * @param trialAdFreeInterval
  * Defines the time interval, in seconds, starting from the moment of the initial app installation,
  * during which users can use the application without ads being displayed while still retaining
  * access to the Rewarded Ads format. Within this interval,
  * users enjoy privileged access to the app's features without intrusive ads.
  *
  * @param mediationExtras
  * Mediation extra parameters.
  */
  static initialize(casId: string, options: InitializationParams = {}): Promise<InitializationStatus> {
    
    if (typeof casId !== 'string') {
      return Promise.reject(new Error('initialize(casId, options?): casId must be a string'));
    }
    const payload: any = {};
    if (options.targetAudience != null) payload.audience = options.targetAudience;
    if (options.showConsentFormIfRequired !== undefined)
      payload.showConsentFormIfRequired = options.showConsentFormIfRequired; 
    if (options.forceTestAds !== undefined)
      payload.forceTestAds = options.forceTestAds; 

    if (Array.isArray(options.testDeviceIds)) payload.testDeviceIds = options.testDeviceIds;
    if (options.mediationExtras != null) payload.mediationExtras = options.mediationExtras;
    if (options.debugPrivacyGeography !== undefined) {
      payload.debugPrivacyGeography = options.debugPrivacyGeography === null ? null : Number(options.debugPrivacyGeography);
    }
    const RN_VERSION = `${reactNativeVersion.major}.${reactNativeVersion.minor}.${reactNativeVersion.patch}`;
    payload.reactNativeVersion = RN_VERSION;
    
    return CASMobileAdsNative.initialize(casId, Object.keys(payload).length ? payload : null);
  }

  /**
   * Is SDK initialized.
   */
  static isInitialized(): Promise<boolean> {
    return CASMobileAdsNative.isInitialized();
  }

 /** Presents the consent flow UI if required; resolves with provider-specific result code. */
  static showConsentFlow(): Promise<number> { return CASMobileAdsNative.showConsentFlow(); }

  /** Returns the underlying native SDK version, e.g. "4.3.0". */
  static getSDKVersion() { return CASMobileAdsNative.getSDKVersion(); }

  /** Enables verbose logging to the native console/logcat. */
  static setDebugLoggingEnabled(enabled: boolean): void {
    CASMobileAdsNative.setDebugLoggingEnabled(enabled);
  }

  /** Mutes/unmutes ad sounds where supported by networks. */
  static setAdSoundsMuted(muted: boolean): void {
    CASMobileAdsNative.setAdSoundsMuted(muted);
  }

  /**
   * Sets the user’s age for ad targeting. Provide a positive integer.
   * Note: Only pass data you are legally allowed to share.
   */
  static setUserAge(age: number): void {
    CASMobileAdsNative.setUserAge(age as any);
  }

  /**
   * Sets the user’s gender for ad targeting.
   * @param gender See {@link Gender}
   */
  static setUserGender(gender: number): void {
    CASMobileAdsNative.setUserGender(gender as any);
  }

  /**
   * Sets a content URL to help contextual targeting, e.g. an article URL.
   * Pass `undefined` to clear the value.
   */
  static setAppContentUrl(contentUrl?: string): void {
    CASMobileAdsNative.setAppContentUrl(contentUrl);
  }

  /** Sets a list of keywords to help contextual targeting. */
  static setAppKeywords(keywords: string[]): void {
    CASMobileAdsNative.setAppKeywords(keywords);
  }

  /** Enables/disables coarse location collection where permitted. Disabled by default. */
  static setLocationCollectionEnabled(enabled: boolean): void {
    CASMobileAdsNative.setLocationCollectionEnabled(enabled);
  }

  /**
   * Sets the trial ad-free interval (in seconds) since first install.
   * During the interval, no ads are shown except Rewarded.
   */
  static setTrialAdFreeInterval(interval: number): void {
    CASMobileAdsNative.setTrialAdFreeInterval(interval as any);
  }

  // -------- Interstitial --------

  /** Returns whether an interstitial is currently loaded and ready to show. */
  static isInterstitialAdLoaded(): Promise<boolean> {
    return CASMobileAdsNative.isInterstitialAdLoaded();
  }
  /** Starts loading an interstitial. Result will be delivered via events. */
  static loadInterstitialAd(): void {
    CASMobileAdsNative.loadInterstitialAd();
  }
  /** Shows a loaded interstitial if available. */
  static showInterstitialAd(): void {
    CASMobileAdsNative.showInterstitialAd();
  }
  /** Enables/disables autoloading for interstitials. */
  static setInterstitialAutoloadEnabled(enabled: boolean): void {
    CASMobileAdsNative.setInterstitialAutoloadEnabled(enabled);
  }
  /** Enables/disables autoshow immediately after an interstitial loads. */
  static setInterstitialAutoshowEnabled(enabled: boolean): void {
    CASMobileAdsNative.setInterstitialAutoshowEnabled(enabled);
  }
  /** Sets minimal interval (seconds) between interstitial shows. */
  static setInterstitialMinInterval(seconds: number): void {
    CASMobileAdsNative.setInterstitialMinInterval(seconds as any);
  }
  /** Restarts the interstitial interval countdown from now. */
  static restartInterstitialInterval(): void {
    CASMobileAdsNative.restartInterstitialInterval();
  }
  /** Destroys interstitial resources. Safe to call multiple times. */
  static destroyInterstitial(): void {
    CASMobileAdsNative.destroyInterstitial();
  }

  // -------- Rewarded --------

  /** Returns whether a rewarded ad is currently loaded and ready to show. */
  static isRewardedAdLoaded(): Promise<boolean> {
    return CASMobileAdsNative.isRewardedAdLoaded();
  }
  /** Starts loading a rewarded ad. Result will be delivered via events. */
  static loadRewardedAd(): void {
    CASMobileAdsNative.loadRewardedAd();
  }
  /** Shows a loaded rewarded ad if available. */
  static showRewardedAd(): void {
    CASMobileAdsNative.showRewardedAd();
  }
  /** Enables/disables autoloading for rewarded ads. */
  static setRewardedAutoloadEnabled(enabled: boolean): void {
    CASMobileAdsNative.setRewardedAutoloadEnabled(enabled);
  }
  /** Destroys rewarded resources. */
  static destroyRewarded(): void {
    CASMobileAdsNative.destroyRewarded();
  }

  // -------- App Open --------

  /** Returns whether an app-open ad is currently loaded and ready to show. */
  static isAppOpenAdLoaded(): Promise<boolean> {
    return CASMobileAdsNative.isAppOpenAdLoaded();
  }
  /** Starts loading an app-open ad. Result will be delivered via events. */
  static loadAppOpenAd(): void {
    CASMobileAdsNative.loadAppOpenAd();
  }
  /** Shows a loaded app-open ad if available. */
  static showAppOpenAd(): void {
    CASMobileAdsNative.showAppOpenAd();
  }
  /** Enables/disables autoloading for app-open ads. */
  static setAppOpenAutoloadEnabled(enabled: boolean): void {
    CASMobileAdsNative.setAppOpenAutoloadEnabled(enabled);
  }
  /** Enables/disables autoshow immediately after an app-open ad loads. */
  static setAppOpenAutoshowEnabled(enabled: boolean): void {
    CASMobileAdsNative.setAppOpenAutoshowEnabled(enabled);
  }
  /** Destroys app-open ad resources. */
  static destroyAppOpen(): void {
    CASMobileAdsNative.destroyAppOpen();
  }
}