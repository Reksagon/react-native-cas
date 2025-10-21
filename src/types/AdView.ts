import type { StyleProp, ViewStyle } from 'react-native';
import type { AdError, AdViewInfo, AdContentInfo } from './AdContent';

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
 * Public props for the `<AdView />` React Native component.
 * All callbacks receive plain JavaScript objects (no `NativeSyntheticEvent` wrappers).
 */
export type AdViewProps = {
  /** Banner size. Defaults to {@link AdViewSize.BANNER}. */
  size?: AdViewSize;
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
   * Automatically load an ad after the component mounts.
   * If `false`, call `ref.loadAd()` manually to start loading.
   */
  loadOnMount?: boolean;
  /**
   * Enables automatic loading of the next ad once the current one is shown or fails.
   * Default behavior may vary per platform.
   */
  autoReload?: boolean;
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
  onAdViewLoaded?: (info: AdViewInfo) => void;
  /** Called when ad loading fails. */
  onAdViewFailed?: (error: AdError) => void;
  /** Called when the user clicks the ad. */
  onAdViewClicked?: () => void;
  /** Called when an ad impression is recorded. */
  onAdViewImpression?: (info: AdContentInfo) => void;
};

/** Public methods available through the `<AdView ref={...} />` reference. */
export type AdViewRef = {
  /** Manually triggers ad loading. */
  loadAd: () => void;
  /** Destroys the native ad view and releases resources. */
  destroy: () => void;
};
