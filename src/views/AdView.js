import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useImperativeHandle, useCallback, useMemo, useState, useReducer, useEffect, } from 'react';
import { View, UIManager, findNodeHandle, useWindowDimensions, NativeSyntheticEvent, Dimensions, LayoutChangeEvent, LayoutRectangle, PixelRatio, Platform, StyleSheet, } from 'react-native';
import { NativeAdView } from '../native/NativeAdView';
import { AdViewCommands } from '../native/Commands';
import { addEventListener, removeEventListener } from '../EventEmitter';
import { AdViewSize } from '../types/Types';
import { CASMobileAds } from '../modules/CASMobileAds';
const EVENTS = {
    ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT: 'ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT',
    ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT: 'ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT',
    ON_NATIVE_UI_COMPONENT_ADVIEW_CLICKED_EVENT: 'ON_NATIVE_UI_COMPONENT_ADVIEW_CLICKED_EVENT',
    ON_NATIVE_UI_COMPONENT_ADVIEW_EXPANDED_EVENT: 'ON_NATIVE_UI_COMPONENT_ADVIEW_EXPANDED_EVENT',
    ON_NATIVE_UI_COMPONENT_ADVIEW_COLLAPSED_EVENT: 'ON_NATIVE_UI_COMPONENT_ADVIEW_COLLAPSED_EVENT',
    ON_NATIVE_UI_COMPONENT_ADVIEW_REVENUE_PAID_EVENT: 'ON_NATIVE_UI_COMPONENT_ADVIEW_REVENUE_PAID_EVENT',
    ON_NATIVE_UI_COMPONENT_ADVIEW_DISPLAYED_EVENT: 'ON_NATIVE_UI_COMPONENT_ADVIEW_DISPLAYED_EVENT',
};
const pr = PixelRatio.get();
const isTablet = (() => {
    const d = pr;
    const w = Dimensions.get('window').width * d;
    const h = Dimensions.get('window').height * d;
    if (d < 2 && (w >= 1000 || h >= 1000))
        return true;
    return d === 2 && (w >= 1920 || h >= 1920);
})();
const BASE = {
    [AdViewSize.B]: { width: 320, height: 50 },
    [AdViewSize.L]: { width: 728, height: 90 },
    [AdViewSize.M]: { width: 300, height: 250 },
    [AdViewSize.A]: { width: 0, height: 0 },
    [AdViewSize.S]: { width: isTablet ? 728 : 320, height: isTablet ? 90 : 50 },
};
const handleAdViewEvent = (event, cb) => {
    cb?.(event.nativeEvent);
};
const getAdaptiveHeightForWidth = async (w) => {
    const api = CASMobileAds?.getAdaptiveBannerHeightForWidth;
    if (typeof api === 'function') {
        try {
            const h = await api(w);
            if (typeof h === 'number' && h > 0)
                return h;
        }
        catch { }
    }
    return BASE[AdViewSize.B].height;
};
export const AdView = forwardRef(function AdView({ style, size, isAutoloadEnabled = true, refreshInterval, onAdViewLoaded, onAdViewFailed, onAdViewClicked, onAdViewImpression, ...nativeProps }, ref) {
    const viewRef = useRef(null);
    const layoutRef = useRef(null);
    const { width: screenWidth } = useWindowDimensions();
    const [containerWidth, setContainerWidth] = useState(null);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const [measured, setMeasured] = useState(() => {
        if (size === AdViewSize.A) {
            return { width: Dimensions.get('window').width, height: BASE[AdViewSize.B].height };
        }
        return BASE[size];
    });
    const containerStyle = useMemo(() => {
        if (size === AdViewSize.A) {
            return StyleSheet.compose(style, {
                width: Dimensions.get('window').width,
            });
        }
        return StyleSheet.compose(style, BASE[size]);
    }, [size, style]);
    const onLayout = useCallback((e) => {
        const layout = { ...e.nativeEvent.layout };
        layoutRef.current = layout;
        setContainerWidth(layout.width);
        if (size === AdViewSize.A || size === AdViewSize.B || size === AdViewSize.S) {
            setMeasured(prev => ({ ...prev, width: layout.width }));
        }
    }, [size]);
    useEffect(() => {
        let cancelled = false;
        const recalc = async () => {
            if (size === AdViewSize.A || size === AdViewSize.S || size === AdViewSize.B) {
                const width = (containerWidth ?? screenWidth);
                const height = size === AdViewSize.M
                    ? BASE[AdViewSize.M].height
                    : await getAdaptiveHeightForWidth(width);
                if (!cancelled)
                    setMeasured({ width, height });
            }
            else {
                setMeasured(BASE[size]);
            }
        };
        recalc();
        return () => { cancelled = true; };
    }, [size, screenWidth, containerWidth]);
    const onLoaded = useCallback((e) => {
        const { width: ew, height: eh } = e.nativeEvent;
        if (Platform.OS === 'android') {
            let w = ew / pr;
            const h = layoutRef.current?.height ?? eh / pr;
            if (Math.floor(w) % 2)
                w += 1;
            else
                w -= 1;
            setMeasured({ width: w, height: h });
        }
        onAdViewLoaded?.();
    }, [onAdViewLoaded]);
    const onFailedCb = useCallback((e) => onAdViewFailed?.(e.nativeEvent), [onAdViewFailed]);
    const onClickedCb = useCallback(() => onAdViewClicked?.(), [onAdViewClicked]);
    const onImpressionCb = useCallback((e) => onAdViewImpression?.(e.nativeEvent), [onAdViewImpression]);
    const isAdLoaded = useCallback(async () => {
        return AdViewCommands.isAdLoaded(viewRef.current);
    }, []);
    const loadAd = useCallback(async () => {
        AdViewCommands.loadAd(viewRef.current);
    }, []);
    useImperativeHandle(ref, () => ({ isAdLoaded, loadAd }), [isAdLoaded, loadAd]);
    return (_jsx(View, { onLayout: onLayout, style: containerStyle, children: _jsx(NativeAdView, { ref: viewRef, style: measured, size: size, isAutoloadEnabled: isAutoloadEnabled, refreshInterval: refreshInterval, onAdViewLoaded: onLoaded, onAdViewFailed: onFailedCb, onAdViewClicked: onClickedCb, onAdViewImpression: onImpressionCb, isAdLoaded: (ready) => {
                const cur = viewRef.current;
                if (cur?.__onIsLoaded) {
                    cur.__onIsLoaded(ready.nativeEvent);
                    cur.__onIsLoaded = null;
                }
            }, ...nativeProps }) }));
});
export const preloadNativeUIComponentAdView = async (adUnitId, adFormat, adViewSize, options = {}) => {
    const { placement = null, customData = null, extraParameters = {}, localExtraParameters = {}, } = options;
    const fn = CASMobileAds?.preloadNativeUIComponentAdView;
    if (typeof fn === 'function') {
        return fn(adUnitId, adFormat, adViewSize, placement, customData, extraParameters, localExtraParameters);
    }
    return Promise.reject(new Error('preloadNativeUIComponentAdView is not implemented'));
};
export const destroyNativeUIComponentAdView = async (adViewId) => {
    if (adViewId === undefined) {
        return Promise.reject(new Error('adViewId is not provided'));
    }
    const fn = CASMobileAds?.destroyNativeUIComponentAdView;
    if (typeof fn === 'function') {
        return fn(adViewId);
    }
    return Promise.reject(new Error('destroyNativeUIComponentAdView is not implemented'));
};
export const addAdViewLoadedListener = (l) => addEventListener(EVENTS.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT, l);
export const removeAdViewLoadedListener = () => removeEventListener(EVENTS.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT);
export const addAdViewLoadFailedListener = (l) => addEventListener(EVENTS.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT, l);
export const removeAdViewLoadFailedListener = () => removeEventListener(EVENTS.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT);
