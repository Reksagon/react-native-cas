// src/utils/native.ts
import React from 'react';
import {
  requireNativeComponent,
  NativeModules,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
  type NativeSyntheticEvent,
} from 'react-native';
import type { AdViewFailedEvent, AdViewPresentedEvent } from './types';
import { BannerAdSize } from './types';

const COMPONENT = 'BannerAdView';

export type NativeBannerProps = ViewProps & {
  style: StyleProp<ViewStyle>;
  onAdViewLoaded: (
    e: NativeSyntheticEvent<{ width: number; height: number }>
  ) => void;
  onAdViewFailed: (e: NativeSyntheticEvent<AdViewFailedEvent>) => void;
  onAdViewClicked: () => void;
  isAdReady: (e: NativeSyntheticEvent<boolean>) => void;
  onAdViewPresented: (e: NativeSyntheticEvent<AdViewPresentedEvent>) => void;
  size: {
    size: BannerAdSize;
    maxWidthDpi?: number;
    isAdaptive?: boolean;
  };
  isAutoloadEnabled?: boolean;
  refreshInterval?: number;
};

// ✅ без будь-яких перевірок/фолбеків — хай впаде одразу, якщо немає в’ю
export const BannerAdView =
  requireNativeComponent<NativeBannerProps>(COMPONENT);

// ✅ Команди задаємо РЯДКАМИ (RN 0.79, Paper)
export const BannerAdViewCommands = {
  isAdReady: 'isAdReady',
  loadNextAd: 'loadNextAd',
} as const;

// ✅ Нативні модулі
export const CasModule = NativeModules.CasModule;
export const MediationManagerModule = NativeModules.MediationManagerModule;
