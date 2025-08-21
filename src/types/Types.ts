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

export enum CCPAStatus {
  Undefined = 0,
  OptOutSale,
  OptInSale,
}

export enum LoadingManagerMode {
  FastestRequests = 0,
  FastRequests,
  Optimal,
  HighPerformance,
  HighestPerformance,
  Manual,
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

export type Location = {
  accuracy: number;
  altitude: number;
  bearing: number;
  latitude: number;
  longitude: number;
};

export type BuildManagerParams = {
  casId?: string;
  consentFlow?: ConsentFlowParams;    
  testMode?: boolean;  
  mediationExtra?: MediationExtraParams;
};

export type TargetingOptions = {
  age: number;
  gender: Gender;
  location?: Location;
  contentUrl: string;
  keywords: Array<string>;
};

export type CASSettings = {
  taggedAudience: Audience;
  ccpaStatus: CCPAStatus;
  trialAdFreeInterval: number;
  debugMode: boolean;
  allowInterstitialAdsWhenVideoCostAreLower: boolean;
  bannerRefreshInterval: number;
  interstitialInterval: number;
  loadingMode: LoadingManagerMode;
  mutedAdSounds: boolean;
  userConsent: ConsentStatus;
  deprecated_analyticsCollectionEnabled: boolean;
  trackLocation?: boolean; // iOS Only
  testDeviceIDs: Array<string>;
};

export type DismissConsentFlowEvent = {
  status: number;
};;

export type InitConfiguration = {
  error?: string;
  countryCode?: string;
  isConsentRequired: boolean;
  consentFlowStatus: number;
};

export type LastPageAdContent = {
  headline: string;
  adText: string;
  destinationURL: string;
  imageURL?: string;
  iconURL?: string;
};

export enum AdViewSize {
  B = 'BANNER',
  L = 'LEADERBOARD',
  M = 'MEDIUM_RECTANGLE',
  A = 'ADAPTIVE',
  S = 'SMART',
}

export enum AdViewPosition {
  TOP_CENTER = 'top_center',
  BOTTOM_CENTER = 'bottom_center',
  CENTERED = 'centered',
  TOP_LEFT = 'top_left',
  TOP_RIGHT = 'top_right',
  BOTTOM_LEFT = 'bottom_left',
  BOTTOM_RIGHT = 'bottom_right',
}

export type AdViewProps = {
  style?: StyleProp<ViewStyle>;
  size: AdViewSize;  
  position?: AdViewPosition;
  isAutoloadEnabled?: boolean;
  refreshInterval?: number;
  adUnitId: string;
  adFormat: string;
  adaptiveBannerEnabled?: boolean;
  autoRefresh?: boolean;
} & AdViewEvents;

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

export type AdViewEvents = {
  onAdViewLoaded?: (event: AdInfoEvent) => void;
  onAdViewFailed?: (event: AdLoadFailedEvent) => void;
  onAdViewClicked?: () => void;
  onAdViewRevenuePaid?: (event: { revenue: number; currency: string }) => void;
  onAdViewExpanded?: () => void;
  onAdViewCollapsed?: () => void;
  onAdViewDisplayed?: (event: AdViewPresentedEvent) => void;
};

export type AdViewRef = {
  loadAd: () => void;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  destroy: () => void;
  isAdLoaded: () => Promise<boolean>;
};

export type AdInfoEvent = Readonly<{
    adUnitId: string;
    adFormat: string;
    adViewId?: number;
    networkName: string;
    networkPlacement: string;
    creativeId?: string | null;
    placement?: string | null;
    revenue: number;
    revenuePrecision: string;
    latencyMillis: number;
    dspName?: string | null;
    size: Readonly<{
        width: number;
        height: number;
    }>;
}>;

export type AdLoadFailedEvent = Readonly<{
    adUnitId: string;
    adViewId?: number;
    code: number;
    message?: string | null;
    mediatedNetworkErrorCode: number;
    mediatedNetworkErrorMessage: string;
    adLoadFailureInfo?: string | null;
}>;

export type AdViewPresentedEvent = Readonly<{
    impression: AdImpression;
    adUnitId: string;
    adFormat: string;
    adViewId?: number;
    networkName: string;
    networkPlacement: string;
    creativeId?: string | null;
    placement?: string | null;
    revenue: number;
    revenuePrecision: string;
    latencyMillis: number;
    dspName?: string | null;
    size: Readonly<{
        width: number;
        height: number;
    }>;
    code: number;
    message?: string | null;
    mediatedNetworkErrorCode: number;
    mediatedNetworkErrorMessage: string;
}>;
