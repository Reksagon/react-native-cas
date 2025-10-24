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
 * All callbacks receive plain JavaScript objects (no `NativeSyntheticEvent` wrappers).
 */
export type BannerAdViewProps = {
  /** Banner size. Defaults to {@link BannerAdSize.BANNER}. */
  size?: BannerAdSize;
  /**
   * Limit inline adaptive banner height.
   * By default, inline adaptive banners instantiated without a maxHeight value have a maxHeight equal to the device height.
   */
  maxHeight?: number;
  /**
   * Sets the width for adaptive banners (inline and anchored).
   * If not specified, the width defaults to the full device width.
   */
  maxWidth?: number;
  /**
   * Optional CAS identifier override.
   * Usually set during SDK initialization; not required for most use cases.
   */
  casId?: string;
  /**
   * Enables automatic reloading of the ad once the current one fails.
   */
  autoReload?: boolean;
  /**
   * Automatic refresh interval in seconds.
   * Set to `0` to disable auto-refresh.
   */
  refreshInterval?: number;
  /** Called when an ad has successfully loaded. */
  onAdViewLoaded?: (info: AdViewInfo) => void;
  /** Called when ad loading fails. */
  onAdViewFailed?: (error: AdError) => void;
  /** Called when the user clicks the ad. */
  onAdViewClicked?: () => void;
  /** Called when an ad impression is recorded. */
  onAdViewImpression?: (info: AdContentInfo) => void;
};

/** Public methods available through the `<AdView ref={...} />` reference. */
export type BannerAdViewRef = {
  /** Manually triggers ad loading. */
  loadAd: () => void;
};
