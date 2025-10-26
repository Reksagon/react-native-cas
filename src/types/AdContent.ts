/**
 * Normalized impression data containing monetization information.
 * Values may vary depending on the ad network.
 */
export type AdContentInfo = {
  /** The ad format (e.g., Banner, MREC, Interstitial, Rewarded, AppOpen). */
  format: string;
  /** The impression revenue in USD. This value can be either estimated or precise depending on the network. */
  revenue: number;
  /** Indicates whether the revenue is "estimated" or "precise". */
  revenuePrecision: string;
  /** The network’s ad unit ID that served this impression. */
  sourceUnitId: string;
  /** Display name of the ad network that purchased the impression. */
  sourceName: string;
  /** Creative identifier, if available (useful for reporting issues). */
  creativeId?: string;
  /** Accumulated ad revenue in USD across all formats for the current user. */
  revenueTotal: number;
  /** Total number of impressions shown to this user across all sessions. */
  impressionDepth: number;
};


/**
 * Information returned when an ad has successfully loaded.
 * Some networks may not provide exact dimensions.
 */
export type AdViewInfo = {
  /** The actual width of the loaded creative in dp. */
  width: number;
  /** The actual height of the loaded creative in dp. */
  height: number;
};

/**
 * Normalized network/mediation error codes.
 *
 * To see the error code, use {@link AdError.code}.
 * To see a human-readable description, use {@link AdError.message}.
 * See the constants below for the list of possible codes.
 */
export enum AdErrorCode {
  /** Indicates an internal error occurred. */
  INTERNAL_ERROR = 0,

  /**
   * Indicates that ads are not ready to be shown.
   * Ensure you call the appropriate ad loading method or use automatic load mode.
   * If using automatic load mode, wait a little longer for ads to be ready.
   */
  NOT_READY = 1,

  /**
   * Indicates that the device is rejected for services.
   * Services may be unavailable for devices that do not meet requirements
   * (for example, country or OS version).
   */
  REJECTED = 2,

  /**
   * Indicates that no ads are available to be served.
   * If ads appear in test/demo mode, your integration is correct and live ads will resume once inventory is available.
   */
  NO_FILL = 3,

  /** Indicates that the ad creative has reached its daily cap for the user (typically for cross-promotion only). */
  REACHED_CAP = 6,

  /** Indicates that the CAS SDK is not initialized. Ensure you add CAS initialization code. */
  NOT_INITIALIZED = 7,

  /**
   * Indicates a timeout because the advertising source did not respond in time.
   * The system will continue waiting for a response, which may delay ad loading or cause a loading error.
   */
  TIMEOUT = 8,

  /** Indicates that there is no internet connection available, which prevents ads from loading. */
  NO_CONNECTION = 9,

  /**
   * Indicates a configuration error in one of the mediation ad sources.
   * Report this error to your support manager for further assistance.
   */
  CONFIGURATION_ERROR = 10,

  /**
   * Indicates that the interval between impressions of interstitial ads has not yet passed.
   * This error may also occur if a trial ad-free interval has been defined and has not yet passed since app start.
   */
  NOT_PASSED_INTERVAL = 11,

  /**
   * Indicates that another fullscreen ad is currently being displayed,
   * preventing new ads from showing. Review your ad display logic to avoid duplicate impressions.
   */
  ALREADY_DISPLAYED = 12,

  /** Indicates that ads cannot be shown because the application is not currently in the foreground. */
  NOT_FOREGROUND = 13,
}


/**
 * Error details returned when an ad fails to load.
 */
export type AdError = {
  /** Numeric error code returned by the network or SDK. */
  code: AdErrorCode;
  /** Human-readable error message. */
  message: string;
};
