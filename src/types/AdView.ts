import type { StyleProp, ViewStyle } from 'react-native';

/** Supported banner sizes */
export enum AdViewSize {
  BANNER = 'B',
  LEADERBOARD = 'L',
  MREC = 'M',
  ADAPTIVE = 'A',
  SMART = 'S',
}

/** Parsed impression payload for banners */
export type AdContentInfo = {
  format: string;
  revenue: number;
  revenuePrecision: string;
  sourceUnitId: string;
  sourceName: string;
  creativeId?: string;
  revenueTotal: number;
  impressionDepth: number;
};

/** Mediation/network error payload */
export type AdError = { code: number; message: string };

/** Public props of the AdView component */
export type AdViewProps = {
  /** Banner size (defaults to BANNER) */
  size?: AdViewSize;
  /** Autoload new ads (defaults to true) */
  isAutoloadEnabled?: boolean;
  /** Load an ad right after mount (defaults to true) */
  loadOnMount?: boolean;
  /** CAS Id. Optional if the SDK was initialized separately */
  casId?: string;
  /** Auto-refresh interval in seconds */
  refreshInterval?: number;
  /** Container style. Minimum height is enforced automatically */
  style?: StyleProp<ViewStyle>;

  /** Fired when an ad is loaded. May include actual width/height */
  onAdViewLoaded?: (e: { width?: number; height?: number }) => void;
  /** Fired when the ad failed to load */
  onAdViewFailed?: (e: AdError) => void;
  /** Fired on banner click */
  onAdViewClicked?: () => void;
  /** Fired on impression with a parsed payload */
  onAdViewImpression?: (e: AdContentInfo) => void;
};

/** The public ref of AdView */
export type AdViewRef = {
  /** Manually trigger loading a new ad */
  loadAd: () => void;
  /** Destroy the native view */
  destroy: () => void;
};

