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

export enum ConsentStatus {
  Undefined = 0,
  Accepted,
  Denied,
}

export enum MediationManagerEvent {
  AdFailedToLoad = 'adFailedToLoad',
  AdLoaded = 'adLoaded',
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

export type AdViewProps = {
  style?: StyleProp<ViewStyle>;
  size: AdViewSize;
  onAdViewLoaded?: () => void;
  onAdViewFailed?: (e: AdViewFailedEvent) => void;
  onAdViewClicked?: () => void;
  onAdViewImpression?: (e: AdViewPresentedEvent) => void;
  isAutoloadEnabled?: boolean;
  refreshInterval?: number;
};

export type AdViewFailedEvent = {
  message: string;
  code: number;
};

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

export type AdViewPresentedEvent = {
  impression: AdImpression;
};

export type AdViewRef = {
  loadAd: () => Promise<void>;
  isAdLoaded: () => Promise<boolean>;
};
