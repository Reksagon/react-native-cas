import type * as React from 'react';
import type { HostComponent, ViewProps } from 'react-native';
import type { Int32, Double, WithDefault, BubblingEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

export type AdViewSize = 'B' | 'L' | 'M' | 'A' | 'S';

type OnLoadedEvent = { width?: Int32; height?: Int32 };
type OnFailedEvent = { code: Int32; message: string };
type OnImpressionEvent = {
  impression: {
    format: string;
    revenue: Double;
    revenuePrecision: string;
    sourceUnitId: string;
    sourceName: string;
    creativeId?: string;
    revenueTotal: Double;
    impressionDepth: Int32;
  };
};


export interface NativeProps extends ViewProps {
  size?: WithDefault<AdViewSize, 'B'>;
  isAutoloadEnabled?: WithDefault<boolean, true>;
  loadOnMount?: WithDefault<boolean, true>;
  casId?: string;
  refreshInterval?: Int32;

  onAdViewLoaded?: BubblingEventHandler<OnLoadedEvent>;
  onAdViewFailed?: BubblingEventHandler<OnFailedEvent>;
  onAdViewClicked?: BubblingEventHandler<{}>;
  onAdViewImpression?: BubblingEventHandler<OnImpressionEvent>;
  
}

type NativeComponent = HostComponent<NativeProps>;

export interface NativeCommands {
  loadAd(ref: React.ElementRef<NativeComponent>): void;
  destroy(ref: React.ElementRef<NativeComponent>): void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['loadAd', 'destroy'],
});

<<<<<<< HEAD
export default codegenNativeComponent<NativeProps>('CASAdView')
=======
export default codegenNativeComponent<NativeProps>('CASAdView')

>>>>>>> b3688904dc3ae90342c08b2165ab0009f9e451c9
