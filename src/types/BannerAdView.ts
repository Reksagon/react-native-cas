import type { AdError, AdViewInfo, AdContentInfo } from './AdContent';

/**
 *  Represents the size of a banner ad.
 */
export enum BannerAdSize {
  /**
   * Standard Banner has a fixed size of 320x50 and is the minimum ad size
   */
  BANNER = 'B',
  /**
   * Leaderboard has a fixed size of 728x90 and is allowed on tablets only.
   */
  LEADERBOARD = 'L',
  /**
   * Medium Rectangle has a fixed size of 300x250.
   */
  MEDIUM_RECTANGLE = 'M',
  /**
   * Adaptive banner ads have a fixed aspect ratio for the maximum width.
   * The adaptive size calculates the optimal height for that width with an aspect ratio similar to 320x50.
   * By default, the full screen width will be used. You can limit width by specifying a `maxWidth` in the parameters.
   */
  ADAPTIVE = 'A',
  /**
   * Inline banner ads have a desired width and a maximum height, useful when you want to limit the banner's height.
   * Inline banners are larger and taller compared to adaptive banners. They have variable height, including Medium Rectangle size,
   * and can be as tall as the device screen. Specify the `maxWidth` and `maxHeight` dimensions to limit the ad size.
   */
  INLINE = 'I',
  /**
   * Smart selects the optimal dimensions depending on the device type.
   * For mobile devices, it returns 320x50, while for tablets, it returns 728x90.
   * In the UI, these banners occupy the same amount of space regardless of device type.
   */
  SMART = 'S',
}

/**
 * Public props for the `<BannerAdView />` React Native component.
 * All callbacks receive plain JavaScript objects (no NativeSyntheticEvent wrappers).
 */
export type BannerAdViewProps = {
  /**
   * Represents the size of a banner ad. {@link BannerAdSize.SMART}.
   */
  size?: BannerAdSize;

  /**
   * Maximum width for Adaptive/Inline banners.
   * If omitted, the width defaults to the full device width.
   * Automatically clamped to the screen bounds and updated on orientation changes.
   */
  maxWidth?: number;

  /**
   * Maximum height for Inline banners.
   * By default, inline adaptive banners without an explicit maxHeight use the device height.
   * Automatically clamped to the screen bounds and updated on orientation changes.
   */
  maxHeight?: number;

  /**
   * The unique identifier of the CAS content for each platform.
   * Leave undefined to use the initialization identifier.
   */
  casId?: string;

  /**
   * If enabled, the ad will automatically retry loading the ad if an error occurs during the loading process.
   * By default enabled.
   */
  autoReload?: boolean;

  /**
   * Sets the refresh interval in seconds for displaying ads.
   * The countdown runs only while the view is visible.
   * Once elapsed, a new ad automatically loads and displays.
   * Default: 30 seconds. Set `0` to disable. 
   * Works regardless of `autoReload`.
   */
  refreshInterval?: number;

  /**
   * Callback to be invoked when the ad content has been successfully loaded.
   */
  onAdViewLoaded?: (info: AdViewInfo) => void;

  /**
   * Callback to be invoked when the ad content fails to load.
   */
  onAdViewFailed?: (error: AdError) => void;

  /**
   * Callback to be invoked when the ad content is clicked by the user.
   */
  onAdViewClicked?: () => void;

  /**
   * Callback to be invoked when an ad is estimated to have earned money.
   */
  onAdViewImpression?: (info: AdContentInfo) => void;
};

/** 
 * Public methods available through the reference.
 * ```
 * <BannerAdView ref={...} />
 * ```
 */
export type BannerAdViewRef = {
  /** Manually triggers ad loading. */
  loadAd: () => void;
};
