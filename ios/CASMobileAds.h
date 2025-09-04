#import <CAS/CAS.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(CASMobileAds, RCTEventEmitter)

// Init
RCT_EXTERN_METHOD(initialize:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(isInitialized:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Preload / Destroy AdViews
RCT_EXTERN_METHOD(preloadNativeUIComponentAdView:(NSString *)adUnitId
                  adFormat:(NSString *)adFormat
                  adViewSize:(NSString *)adViewSize
                  placement:(NSString * _Nullable)placement
                  customData:(NSString * _Nullable)customData
                  extraParameters:(NSDictionary * _Nullable)extraParameters
                  localExtraParameters:(NSDictionary * _Nullable)localExtraParameters
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(destroyNativeUIComponentAdView:(nonnull NSNumber *)adViewId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getAdaptiveBannerHeightForWidth:(nonnull NSNumber *)width
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Interstitial
RCT_EXTERN_METHOD(isInterstitialAdLoaded:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(loadInterstitialAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(showInterstitialAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Rewarded
RCT_EXTERN_METHOD(isRewardedAdLoaded:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(loadRewardedAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(showRewardedAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// AppOpen
RCT_EXTERN_METHOD(isAppOpenAdLoaded:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(loadAppOpenAd:(BOOL)isLandscape
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(showAppOpenAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Other
RCT_EXTERN_METHOD(getSDKVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setTestMode:(BOOL)enabled)

// Consent
RCT_EXTERN_METHOD(showConsentFlow:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setConsentFlowEnabled:(BOOL)enabled
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Targeting
RCT_EXTERN_METHOD(getTargetingOptions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setTargetingOptions:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Settings
RCT_EXTERN_METHOD(getSettings:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setSettings:(NSDictionary *)settings
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
