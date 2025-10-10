import type * as React from 'react';
import type { HostComponent, ViewProps } from 'react-native';
import type { Int32, WithDefault, BubblingEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

export type AdViewSize = 'B' | 'L' | 'M' | 'A' | 'S';

type OnLoadedEvent = { width?: Int32; height?: Int32 };
type OnFailedEvent = { error: { code: Int32; message: string } };
type OnIsLoadedEvent = { isAdLoaded: boolean };
type OnImpressionEvent = { data: string };

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
  onAdViewIsLoaded?: BubblingEventHandler<OnIsLoadedEvent>;
}

type NativeComponent = HostComponent<NativeProps>;

export interface NativeCommands {
  isAdLoaded(ref: React.ElementRef<NativeComponent>): void;
  loadAd(ref: React.ElementRef<NativeComponent>): void;
  destroy(ref: React.ElementRef<NativeComponent>): void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['isAdLoaded', 'loadAd', 'destroy'],
});

export default codegenNativeComponent<NativeProps>('AdView')

