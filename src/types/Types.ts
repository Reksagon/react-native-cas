/** Audience category used for regulatory handling and content filtering. */
export enum Audience {
  Undefined = 0,
  Children,
  NotChildren,
}

/** User’s geography used to determine which privacy rules apply. */
export enum PrivacyGeography {
  /** Geography is unknown. */
  unknown = 0,
  /** European Economic Area (GDPR). */
  europeanEconomicArea = 1,
  /** A regulated US state (e.g., CPRA). */
  regulatedUSState = 3,
  /** No active regulation detected. */
  unregulated = 4,
}

/** Initialization options for the SDK bootstrap. */
export type InitializationParams = {
  /**
   * Indicates the target {@link Audience} of the app for regulatory and content purposes.
   * This may affect how the SDK handles data collection, personalization,
   * and content rendering, especially for audiences such as children.
   */
  targetAudience?: Audience;
  /**
   * Shows the consent form only if it is required and the user has not responded previously.
   * If the consent status is required, the SDK loads a form and immediately presents it.
   */
  showConsentFormIfRequired?: boolean;
  /**
   * Enable test ads mode that will always return test ads for all devices.
   * **Attention** Don't forget to set it to False after the tests are completed.
   */
  forceTestAds?: boolean;
  /**
   * Add a test device ID corresponding to test devices which will always request test ads.
   * List of test devices should be defined before first MediationManager initialized.
   *
   * 1. Run an app with the CAS SDK `initialize()` call.
   * 2. Check the console or logcat output for a message that looks like this:
   * "To get test ads on this device, set ... "
   * 3. Copy your alphanumeric test device ID to your clipboard.
   * 4. Add the test device ID to the `testDeviceIds` list.
   */
  testDeviceIds?: string[];
  /** Overrides detected privacy geography for debugging. */
  debugPrivacyGeography?: PrivacyGeography;
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
  consentFlowStatus: ConsentFlowStatus;
};

export enum ConsentFlowStatus {
  UNKNOWN = 0,
  /// User consent obtained. Personalized vs non-personalized undefined.
  OBTAINED = 3,
  /// User consent not required.
  NOT_REQUIRED = 4,
  /// User consent unavailable.
  UNAVAILABLE = 5,
  /// There was an internal error.
  INTERNAL_ERROR = 10,
  /// There was an error loading data from the network.
  NETWORK_ERROR = 11,
  /// There was an error with the UI context is passed in.
  INVALID_CONTEXT = 12,
  /// There was an error with another form is still being displayed.
  STILL_PRESENTING = 13,
}

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

export type AdError = {
  code: AdErrorCode;
  message: string;
};

export type ConsentFlowParams = {
  enabled?: boolean;
  privacyPolicy?: string;
  requestGDPR?: boolean;
  requestATT?: boolean;
};

export enum PrivacyGeography {
  Unknown = 0,
  EuropeanEconomicArea = 1,
  RegulatedUSState = 3,
  Unregulated = 4,
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

/** Optional targeting value. */
export enum Gender {
  Unknown = 0,
  Male,
  Female,
}
