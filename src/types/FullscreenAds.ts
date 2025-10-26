import type { AdError, AdContentInfo } from './AdContent';

export type Unsubscribe = () => void;

/**
 * Public interfaces for fullscreen ad surfaces.
 * Each function mirrors a native command or emits a native event.
 *
 * Events:
 * - Loaded / FailedToLoad: fired after `loadAd()`
 * - Showed / FailedToShow / Dismissed / Clicked: lifecycle of `showAd()`
 * - Impression: contains parsed revenue/partner payload (see AdContentInfo)
 */
export type FullscreenAdBase = {
  /**
   * Indicates whether the ad is currently loaded and ready to be shown.
   * Use before calling {@link showAd} when your flow requires it.
   */
  isAdLoaded(): Promise<boolean>;

  /**
   * Manual retry to load the ad.
   * If autoload is enabled, loading/retry happens automatically when needed.
   */
  loadAd(): void;

  /**
   * Display this ad on top of the application.
   * Register event listeners before calling to get lifecycle callbacks.
   */
  showAd(): void;

  /** Frees the underlying native resources. */
  destroy(): void;

  /**
   * Enables automatic loading of the next ad.
   * When enabled, the SDK loads a new ad after dismissal and retries on load errors.
   */
  setAutoloadEnabled(enabled: boolean): void;

  /** Fired when the ad content has been successfully loaded. Returns unsubscribe. */
  addAdLoadedEventListener(l: () => void): Unsubscribe;

  /** Fired when the ad content fails to load. Returns unsubscribe. */
  addAdFailedToLoadEventListener(l: (error: AdError) => void): Unsubscribe;

  /** Fired when the ad fails to present. Returns unsubscribe. */
  addAdFailedToShowEventListener(l: (error: AdError) => void): Unsubscribe;

  /** Fired when the ad is presented to the user. Returns unsubscribe. */
  addAdShowedEventListener(l: () => void): Unsubscribe;

  /** Fired when the ad is clicked. Returns unsubscribe. */
  addAdClickedEventListener(l: () => void): Unsubscribe;

  /**
   * Fired when an impression occurs. Provides monetization payload.
   * Available for allowlisted accounts only.
   * Returns unsubscribe.
   */
  addAdImpressionEventListener(l: (info: AdContentInfo) => void): Unsubscribe;

  /**
   * Fired when the ad is closed/dismissed by the user.
   * Returns unsubscribe.
   */
  addAdDismissedEventListener(l: () => void): Unsubscribe;
};

/** App-open specific options. */
export type AppOpenAdType = FullscreenAdBase & {
  /**
   * Controls whether the ad should be automatically displayed when the user returns to the app.
   * Note: the ad must be ready at the moment the app returns to foreground.
   */
  setAutoshowEnabled(enabled: boolean): void;
};

export type InterstitialAdType = FullscreenAdBase & {
  /** Shows ad automatically once it loads. */
  setAutoshowEnabled(enabled: boolean): void;

  /**
   * The minimum interval between showing interstitial ads, in seconds.
   * Showing earlier will trigger onAdFailedToShow with codeNotPassedInterval.
   * The timer is shared across instances; values may differ per instance.
   */
  setMinInterval(seconds: number): void;

  /**
   * Restarts the interval countdown until the next interstitial ad display.
   * Useful to delay an interstitial after showing Rewarded/AppOpen.
   */
  restartInterval(): void;
};

/** Rewarded specific events. */
export type RewardedAdType = FullscreenAdBase & {
  /**
   * Called when the user has earned the reward.
   * Note: This differs from the dismissed callback — a user might dismiss without earning a reward.
   */
  addAdUserEarnRewardEventListener(l: () => void): Unsubscribe;
};
