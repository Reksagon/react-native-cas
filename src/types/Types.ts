import type { StyleProp, ViewStyle } from 'react-native';

export type ConsentFlowParams = {
  enabled?: boolean;
  privacyPolicy?: string;
  requestGDPR?: boolean;
  requestATT?: boolean;
};

export type MediationExtraParams = {
  key: string;
  value: string;
};

export enum AdType {
  Banner = 0,
  Interstitial,
  Rewarded,
  AppOpen,
  Native,
  None,
}

export enum Gender {
  Unknown = 0,
  Male,
  Female,
}

export enum Audience {
  Undefined = 0,
  Children,
  NotChildren,
}

export type BuildManagerParams = {
  casId?: string;
  consentFlow?: ConsentFlowParams;
  testMode?: boolean;
  mediationExtra?: MediationExtraParams;
};

export type CASSettings = {
  taggedAudience: Audience;
  age: number;
  gender: Gender;
  contentUrl?: string;
  keywords: Array<string>;
  debugMode: boolean;
  mutedAdSounds: boolean;
  testDeviceIDs: Array<string>;
  locationCollectionEnabled?: boolean;
};

export type DismissConsentFlowEvent = {
  status: number;
};

export type InitConfiguration = {
  error?: string;
  countryCode?: string;
  isConsentRequired: boolean;
  consentFlowStatus: number;
};

export enum AdViewSize {
  B = 'BANNER',
  L = 'LEADERBOARD',
  M = 'MEDIUM_RECTANGLE',
  A = 'ADAPTIVE',
  S = 'SMART',
}

export type AdInfoEvent = Readonly<{
  adUnitId?: string;
  adFormat?: string;
  adViewId?: number;
  networkName?: string;
  networkPlacement?: string;
  creativeId?: string | null;
  placement?: string | null;
  revenue?: number;
  revenuePrecision?: string;
  latencyMillis?: number;
  dspName?: string | null;
  size?: Readonly<{
    width: number;
    height: number;
  }>;
}>;

export type AdLoadFailedEvent = Readonly<{
  adUnitId?: string;
  adViewId?: number;
  code: number;
  message?: string | null;
  mediatedNetworkErrorCode?: number;
  mediatedNetworkErrorMessage?: string;
  adLoadFailureInfo?: string | null;
}>;

export type AdContentInfo = {
  format: String;
  network: string;  
  creativeId?: string;
  revenue: number;  
  revenuTotal: number;
  revenuePrecision: string;    
  sourceUnitId: string;
  impressionDepth: number;
};

export type AdViewPresentedEvent = Readonly<{
  impression: AdContentInfo;
}>;

export type AdViewProps = {
  style?: StyleProp<ViewStyle>;
  size: AdViewSize;
  isAutoloadEnabled?: boolean;
  refreshInterval?: number;
  onAdViewLoaded?: () => void;
  onAdViewFailed?: (e: AdLoadFailedEvent) => void;
  onAdViewClicked?: () => void;
  onAdViewImpression?: (e: AdViewPresentedEvent) => void;
};

export type AdViewRef = {
  loadAd: () => Promise<void>;
  isAdLoaded: () => Promise<boolean>;
};
