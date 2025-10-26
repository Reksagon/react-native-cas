import type { AdError, AdViewInfo, AdContentInfo } from './AdContent';

/**
 * Supported banner sizes.
 *
 * - **BANNER** – Standard 320×50 phone banner.
 * - **LEADERBOARD** – 728×90 banner for tablets and wide screens.
 * - **MEDIUM_RECTANGLE** – 300×250 medium rectangle format.
 * - **ADAPTIVE** – Adaptive banner that adjusts height based on available width.
 * - **SMART** – Automatically selects the most appropriate size for the device.
 */
export enum BannerAdSize {
  BANNER = 'B',
  LEADERBOARD = 'L',
  MEDIUM_RECTANGLE = 'M',
  ADAPTIVE = 'A',
  INLINE = 'I',
  SMART = 'S',
}

/**
 * Public props for the `<AdView />` React Native component.
 * All callbacks receive plain JavaScript objects (no NativeSyntheticEvent wrappers).
 */
export type BannerAdViewProps = {
  /** Banner size. Defaults to {@link BannerAdSize.BANNER}. */
  size?: BannerAdSize;

  /**
   * Maximum height for Inline banners.
   * By default, inline adaptive banners without an explicit maxHeight use the device height.
   * Automatically clamped to the screen bounds and updated on orientation changes.
   */
  maxHeight?: number;

  /**
   * Maximum width for Adaptive/Inline banners.
   * If omitted, the width defaults to the full device width.
   * Automatically clamped to the screen bounds and updated on orientation changes.
   */
  maxWidth?: number;

  /**
   * Optional CAS identifier override for this specific view.
   * Usually set during SDK initialization; not required for most use cases.
   */
  casId?: string;

  /**
   * If enabled, the ad will automatically retry loading when a load error occurs.
   */
  autoReload?: boolean;

  /**
   * Sets the refresh interval in seconds for displaying ads.
   * The countdown runs only while the view is visible.
   * Once elapsed, a new ad automatically loads and displays.
   * Set `0` to disable. Default: 30 seconds.
   * Works regardless of {@link autoReload}.
   */
  refreshInterval?: number;

  /** Fired when an ad is loaded. Provides actual creative `width`/`height` in dp. */
  onAdViewLoaded?: (info: AdViewInfo) => void;

  /** Fired when the ad fails to load with a normalized error code and message. */
  onAdViewFailed?: (error: AdError) => void;

  /** Fired when the user taps the ad. */
  onAdViewClicked?: () => void;

  /** Fired on impression with monetization info (revenue, network, unit ID, etc.). */
  onAdViewImpression?: (info: AdContentInfo) => void;
};


/** Public methods available through the `<AdView ref={...} />` reference. */
export type BannerAdViewRef = {
  /** Manually triggers ad loading. */
  loadAd: () => void;
};
