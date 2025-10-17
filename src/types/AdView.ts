import type { StyleProp, ViewStyle } from 'react-native';

/** Supported banner sizes */
export enum AdViewSize {
  BANNER = 'B',
  LEADERBOARD = 'L',
  MREC = 'M',
  ADAPTIVE = 'A',
  SMART = 'S',
}

/** Payloads that your callbacks receive (plain objects, без RN events) */
export type AdViewLoaded = {
  width?: number;
  height?: number;
};

export type AdViewFailed = {
  code: number;
  message: string;
};

export type AdImpression = {
  format: string;
  revenue: number;
  revenuePrecision: string;
  sourceUnitId: string;
  sourceName: string;
  creativeId?: string;
  revenueTotal: number;
  impressionDepth: number;
};

/** Public props of the AdView component */
export type AdViewProps = {
  size?: AdViewSize;
  isAutoloadEnabled?: boolean;
  loadOnMount?: boolean;
  casId?: string;
  refreshInterval?: number;

  /** Container style. Minimum height is enforced automatically */
  style?: StyleProp<ViewStyle>;

  onAdViewLoaded?: (data: AdViewLoaded) => void;
  onAdViewFailed?: (err: AdViewFailed) => void;
  onAdViewClicked?: () => void;
  onAdViewImpression?: (info: AdImpression) => void;
};

/** Public ref methods available on <AdView ref={...} /> */
export type AdViewRef = {
  loadAd: () => void;
  destroy: () => void;
};
