import type { StyleProp, ViewStyle } from 'react-native';

export enum AdErrorCode {
  INTERNAL_ERROR = 0,
  NO_FILL = 1,
  NO_CONNECTION = 2,
  REACHED_CAP = 3,
  ALREADY_DISPLAYED = 4,
  CONFIGURATION_ERROR = 5,
  NOT_READY = 6,
  NOT_PASSED_INTERVAL = 7,
  NOT_INITIALIZED = 8,
  NOT_FOREGROUND = 9,
  TIMEOUT = 10,
}

export type AdError = {
  code: AdErrorCode;
  message: string;
};


export type AdLoadFailedEvent = Readonly<{
  adUnitId?: string;
  adViewId?: number;
  code?: number;
  message?: string | null;
  mediatedNetworkErrorCode?: number;
  mediatedNetworkErrorMessage?: string;
  adLoadFailureInfo?: string | null;
}>;

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

export type BuildManagerParams = {
  casId?: string;
  consentFlow?: ConsentFlowParams;
  testMode?: boolean;
  mediationExtra?: MediationExtraParams;
};

export type InitConfiguration = {
  error?: string;
  countryCode?: string;
  isConsentRequired: boolean;
  consentFlowStatus: number;
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

export type TargetingOptions = {
  age: number;
  gender: Gender;
  contentUrl?: string;
  keywords: string[];
};

export type CASSettings = {
  taggedAudience: Audience;
  age: number;
  gender: Gender;
  contentUrl?: string;
  keywords: string[];
  debugMode: boolean;
  mutedAdSounds: boolean;
  testDeviceIDs: string[];
  locationCollectionEnabled?: boolean;
  trialAdFreeInterval?: number;
};

export type DismissConsentFlowEvent = {
  status: number;
};

export enum AdViewSize {
  BANNER = 'B',
  LEADERBOARD = 'L',
  MREC = 'M',
  ADAPTIVE = 'A',
  SMART = 'S',
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

export type AdImpression = {
  adType: AdType;
  cpm: number;
  error?: string;
  identifier: string;
  impressionDepth: number;
  lifetimeRevenue: number;
  network: string;
  priceAccuracy: number;
  status: string;
  versionInfo: string;
  creativeIdentifier?: string;
};

export type AdViewPresentedEvent = Readonly<{
  impression: AdImpression;
}>;

export type AdViewProps = {
  style?: StyleProp<ViewStyle>;
  size: AdViewSize;
  isAutoloadEnabled?: boolean;
  refreshInterval?: number;
  casId?: string;
  onAdViewLoaded?: () => void;
  onAdViewFailed?: (e: AdLoadFailedEvent) => void;
  onAdViewClicked?: () => void;
  onAdViewImpression?: (e: AdViewPresentedEvent) => void;
};

export type AdViewRef = {
  loadAd: () => Promise<void>;
  isAdLoaded: () => Promise<boolean>;
};