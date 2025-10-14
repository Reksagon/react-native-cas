/** Audience category used for regulatory handling and content filtering. */
export enum Audience {
  Undefined = 0,
  Children,
  NotChildren,
}

/** User’s geography used to determine which privacy rules apply. */
export enum PrivacyGeography {
  /** Geography is unknown. */                   unknown = 0,
  /** European Economic Area (GDPR). */          europeanEconomicArea = 1,
  /** A regulated US state (e.g., CPRA). */      regulatedUSState = 3,
  /** No active regulation detected. */          unregulated = 4,
}

/** Initialization options for the SDK bootstrap. */
export type InitializationParams = {
  /** Declares the intended audience of your app. */
  targetAudience?: Audience;
  /** Shows consent form only if needed and not answered before. */
  showConsentFormIfRequired?: boolean;
  /** Forces test ads for all devices. */
  forceTestAds?: boolean;
  /** List of device IDs that should always get test ads. */
  testDeviceIds?: string[];
  /** Overrides detected privacy geography for debugging. */
  debugPrivacyGeography?: PrivacyGeography | null;
  /** Optional mediation extras (network-specific). */
  mediationExtras?: { [key: string]: string };
};

/** Result of the SDK initialization attempt. */
export type InitializationStatus = {
  /** Error description if initialization failed. */
  error?: string;
  /** Two-letter ISO country code if available. */
  countryCode?: string;
  /** Whether consent is required for this user. */
  isConsentRequired: boolean;
  /** Provider-specific consent flow status code. */
  consentFlowStatus: number;
};

/** Normalized network/mediation error codes. */
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

/** Optional targeting value. */
export enum Gender { Unknown = 0, Male, Female }
