/**
 * Normalized impression data containing monetization information.
 * Values may vary depending on the ad network.
 */
export type AdContentInfo = {
  /** The ad format (e.g., Banner, MREC, Interstitial). */
  format: string;
  /** Revenue for this impression, typically in USD. */
  revenue: number;
  /** Revenue precision (e.g., "estimated", "precise"). */
  revenuePrecision: string;
  /** The source unit ID provided by the network. */
  sourceUnitId: string;
  /** The ad network name (e.g., AdMob, AppLovin). */
  sourceName: string;
  /** The creative ID, if available. */
  creativeId?: string;
  /** The total accumulated revenue for the session, if tracked by SDK. */
  revenueTotal: number;
  /** The waterfall or auction depth index of this impression. */
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
