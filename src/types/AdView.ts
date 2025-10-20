import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Supported banner sizes.
 *
 * - **BANNER** – Standard 320×50 phone banner.
 * - **LEADERBOARD** – 728×90 banner for tablets and wide screens.
 * - **MREC** – 300×250 medium rectangle format.
 * - **ADAPTIVE** – Adaptive banner that adjusts height based on available width.
 * - **SMART** – Automatically selects the most appropriate size for the device.
 */
export enum AdViewSize {
  BANNER = 'B',
  LEADERBOARD = 'L',
  MREC = 'M',
  ADAPTIVE = 'A',
  SMART = 'S',
}
/**
 * Information returned when an ad has successfully loaded.
 * Some networks may not provide exact dimensions.
 */
export type AdViewLoaded = {
  /** The actual width of the loaded creative in pixels (if available). */
  width?: number;
  /** The actual height of the loaded creative in pixels (if available). */
  height?: number;
};
/**
 * Error details returned when an ad fails to load.
 */
export type AdViewFailed = {
  /** Numeric error code returned by the network or SDK. */
  code: number;
  /** Human-readable error message. */
  message: string;
};
/**
 * Normalized impression data containing monetization information.
 * Values may vary depending on the ad network.
 */
export type AdImpression = {
  /** The ad format (e.g., Banner, MREC, Adaptive). */
  format: string;
  /** Revenue for this impression, typically in USD. */
  revenue: number;
  /** Revenue precision (e.g., "estimated", "precise"). */
  revenuePrecision: string;
  /** The source unit ID provided by the network. */
  sourceUnitId: string;
  /** The ad network name (e.g., AdMob, AppLovin). */
  sourceName: string;
  /** The creative ID, if available. */
  creativeId?: string;
  /** The total accumulated revenue for the session, if tracked by SDK. */
  revenueTotal: number;
  /** The waterfall or auction depth index of this impression. */
  impressionDepth: number;
};
/**
 * Public props for the `<AdView />` React Native component.
 * All callbacks receive plain JavaScript objects (no `NativeSyntheticEvent` wrappers).
 */
export type AdViewProps = {
  /** Banner size. Defaults to `BANNER`. */
  size?: AdViewSize;
  /**
   * Enables automatic loading of the next ad once the current one is shown or fails.
   * Default behavior may vary per platform.
   */
  isAutoloadEnabled?: boolean;
  /**
   * Automatically load an ad after the component mounts.
   * If `false`, call `ref.loadAd()` manually to start loading.
   */
  loadOnMount?: boolean;
  /**
   * Optional CAS identifier override.
   * Usually set during SDK initialization; not required for most use cases.
   */
  casId?: string;
  /**
   * Automatic refresh interval in seconds.
   * Set to `0` or omit to disable auto-refresh.
   */
  refreshInterval?: number;
  /**
   * Container style. The minimum height is applied automatically
   * once an ad is successfully loaded.
   */
  style?: StyleProp<ViewStyle>;
  /** Called when an ad has successfully loaded. */
  onAdViewLoaded?: (data: AdViewLoaded) => void;
  /** Called when ad loading fails. */
  onAdViewFailed?: (err: AdViewFailed) => void;
  /** Called when the user clicks the ad. */
  onAdViewClicked?: () => void;
  /** Called when an ad impression is recorded. */
  onAdViewImpression?: (info: AdImpression) => void;
};

/** Public methods available through the `<AdView ref={...} />` reference. */
export type AdViewRef = {
  /** Manually triggers ad loading. */
  loadAd: () => void;
  /** Destroys the native ad view and releases resources. */
  destroy: () => void;
};
