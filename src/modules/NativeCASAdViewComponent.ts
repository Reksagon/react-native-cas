import type * as React from 'react';
import type { HostComponent, ViewProps } from 'react-native';
import type {
  Int32,
  Double,
  WithDefault,
  DirectEventHandler,
  Float,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

type OnLoadedEvent = { width: Float; height: Float };
type OnFailedEvent = { code: Int32; message: string };
type OnImpressionEvent = {
  format: string;
  revenue: Double;
  revenuePrecision: string;
  sourceUnitId: string;
  sourceName: string;
  creativeId?: string;
  revenueTotal: Double;
  impressionDepth: Int32;
};

export interface NativeProps extends ViewProps {
  sizeConfig?: {
    sizeType: string;
    maxHeight: Float;
    maxWidth: Float;
  };
  autoReload?: WithDefault<boolean, true>;
  casId?: string;
  refreshInterval?: Int32;

  onAdViewLoaded?: DirectEventHandler<OnLoadedEvent>;
  onAdViewFailed?: DirectEventHandler<OnFailedEvent>;
  onAdViewClicked?: DirectEventHandler<object>;
  onAdViewImpression?: DirectEventHandler<OnImpressionEvent>;
}

type CASAdViewNativeComponentType = HostComponent<NativeProps>;

/**
 * Native commands callable from JS.
 */
interface NativeCommands {
  loadAd(ref: React.ElementRef<CASAdViewNativeComponentType>): void;
}

/**
 * JS interface to ad view commands.
 */
export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['loadAd'],
});

/**
 * Native view component for displaying a ad view.
 */
export default codegenNativeComponent<NativeProps>('CASAdView') as HostComponent<NativeProps>;
