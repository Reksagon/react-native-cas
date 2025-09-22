import type { StyleProp, ViewStyle, NativeSyntheticEvent } from 'react-native';

// TODO: https://github.com/cleveradssolutions/CAS-Android/wiki/Ad-errors
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

export type MediationExtraParams = {
  key: string;
  value: string;
};
export type BuildManagerParams = {
  casId: string;
  testMode: boolean;
};

export type InitConfiguration = {
  error?: string;
  countryCode?: string;
  isConsentRequired: boolean;
  consentFlowStatus: number;
};

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

export enum AdViewSize {
  BANNER = 'B',
  LEADERBOARD = 'L',
  MREC = 'M',
  ADAPTIVE = 'A',
  SMART = 'S',
}

export type AdViewFailedEvent = Readonly<{
  error: AdError;
}>;

export enum AdType {
  Banner = 0,
  Interstitial,
  Rewarded,
  AppOpen,
  None,
}

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

export type AdViewImpressionEvent = Readonly<{
  impression: AdContentInfo;
}>;

export type AdViewProps = {
  style?: StyleProp<ViewStyle>;
  size: AdViewSize;
  isAutoloadEnabled?: boolean;
  refreshInterval?: number;
  casId?: string;

  onAdViewLoaded?: (e: NativeSyntheticEvent<any>) => void;
  onAdViewFailed?: (e: NativeSyntheticEvent<{ error: AdError }>) => void;
  onAdViewClicked?: () => void;
  onAdViewImpression?: (e: NativeSyntheticEvent<{ impression: AdContentInfo }>) => void;
  isAdLoaded?: (ready: NativeSyntheticEvent<boolean>) => void;
};

export type AdViewRef = {
  loadAd: () => Promise<void>;
  isAdLoaded: () => Promise<boolean>;
};
