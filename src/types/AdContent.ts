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

/**
 * Error details returned when an ad fails to load.
 */
export type AdError = {
  /** Numeric error code returned by the network or SDK. */
  code: AdErrorCode;
  /** Human-readable error message. */
  message: string;
};
