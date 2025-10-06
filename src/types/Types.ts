export enum Audience {
  Undefined = 0,
  Children,
  NotChildren,
}

export enum PrivacyGeography {
  unknown = 0,
  europeanEconomicArea = 1,
  regulatedUSState = 3,
  unregulated = 4,
}

export type InitializationParams = {
  targetAudience?: Audience;
  showConsentFormIfRequired?: boolean;
  forceTestAds?: boolean;
  testDeviceIds?: string[];
  debugPrivacyGeography?: PrivacyGeography | null; 
  mediationExtras?: { [key: string]: string };
};

export type InitializationStatus = {
  error?: string;
  countryCode?: string;
  isConsentRequired: boolean;
  consentFlowStatus: number;
};

export enum AdErrorCode {
  INTERNAL_ERROR = 0,
  NOT_READY = 1,
  REJECTED = 2,
  NO_FILL = 3,
  REACHED_CAP = 6,
  NOT_INITIALIZED = 7,
  TIMEOUT = 8,
  NO_CONNECTION = 9,
  CONFIGURATION_ERROR = 10,
  NOT_PASSED_INTERVAL = 11,
  ALREADY_DISPLAYED = 12,
  NOT_FOREGROUND = 13,
}

export type AdError = {
  code: AdErrorCode;
  message: string;
};

export enum Gender {
  Unknown = 0,
  Male,
  Female,
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
