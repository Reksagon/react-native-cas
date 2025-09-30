#import "CASMobileAds.h"
#import <CleverAdsSolutions/CASTypeFlags.h>
#import <CleverAdsSolutions/CASInternalUtils.h>
#import <CleverAdsSolutions/CleverAdsSolutions.h>
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>

#ifdef RCT_NEW_ARCH_ENABLED

using namespace facebook::react;

@implementation CASMobileAds {
  BOOL hasListeners;
  CASInterstitial *interstitial;
  CASRewarded *rewarded;
  CASAppOpen *appOpen;
  CASConsentFlow *consentFlow;
  CASMediationManager *manager;
}

typedef NS_ENUM(NSInteger, CASMobileAdsEvent) {
  onAppOpenLoaded,
  onAppOpenLoadFailed,
  onAppOpenDisplayed,
  onAppOpenFailedToShow,
  onAppOpenHidden,
  onAppOpenClicked,
  onAppOpenImpression,
  onInterstitialLoaded,
  onInterstitialLoadFailed,
  onInterstitialClicked,
  onInterstitialDisplayed,
  onInterstitialFailedToShow,
  onInterstitialHidden,
  onInterstitialImpression,
  onRewardedLoaded,
  onRewardedLoadFailed,
  onRewardedClicked,
  onRewardedDisplayed,
  onRewardedFailedToShow,
  onRewardedHidden,
  onRewardedCompleted,
  onRewardedImpression,
  consentFlowDismissed
};

static NSString * _Nonnull CASMobileAdsEventToString(CASMobileAdsEvent event) {
  switch (event) {
    case onAppOpenLoaded: return @"onAppOpenLoaded";
    case onAppOpenLoadFailed: return @"onAppOpenLoadFailed";
    case onAppOpenDisplayed: return @"onAppOpenDisplayed";
    case onAppOpenFailedToShow: return @"onAppOpenFailedToShow";
    case onAppOpenHidden: return @"onAppOpenHidden";
    case onAppOpenClicked: return @"onAppOpenClicked";
    case onAppOpenImpression: return @"onAppOpenImpression";
    case onInterstitialLoaded: return @"onInterstitialLoaded";
    case onInterstitialLoadFailed: return @"onInterstitialLoadFailed";
    case onInterstitialClicked: return @"onInterstitialClicked";
    case onInterstitialDisplayed: return @"onInterstitialDisplayed";
    case onInterstitialFailedToShow: return @"onInterstitialFailedToShow";
    case onInterstitialHidden: return @"onInterstitialHidden";
    case onInterstitialImpression: return @"onInterstitialImpression";
    case onRewardedLoaded: return @"onRewardedLoaded";
    case onRewardedLoadFailed: return @"onRewardedLoadFailed";
    case onRewardedClicked: return @"onRewardedClicked";
    case onRewardedDisplayed: return @"onRewardedDisplayed";
    case onRewardedFailedToShow: return @"onRewardedFailedToShow";
    case onRewardedHidden: return @"onRewardedHidden";
    case onRewardedCompleted: return @"onRewardedCompleted";
    case onRewardedImpression: return @"onRewardedImpression";
    case consentFlowDismissed: return @"consentFlowDismissed";
  }
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"onAppOpenLoaded",
    @"onAppOpenLoadFailed",
    @"onAppOpenDisplayed",
    @"onAppOpenFailedToShow",
    @"onAppOpenHidden",
    @"onAppOpenClicked",
    @"onAppOpenImpression",
    @"onInterstitialLoaded",
    @"onInterstitialLoadFailed",
    @"onInterstitialClicked",
    @"onInterstitialDisplayed",
    @"onInterstitialFailedToShow",
    @"onInterstitialHidden",
    @"onInterstitialImpression",
    @"onRewardedLoaded",
    @"onRewardedLoadFailed",
    @"onRewardedClicked",
    @"onRewardedDisplayed",
    @"onRewardedFailedToShow",
    @"onRewardedHidden",
    @"onRewardedCompleted",
    @"onRewardedImpression",
    @"consentFlowDismissed"
  ];
}

RCT_EXPORT_MODULE();

#pragma mark - TurboModule Spec Methods

- (std::shared_ptr<TurboModule>)getTurboModule:(const ObjCTurboModule::InitParams &)params
{
  return std::make_shared<NativeCASMobileAdsModuleSpecJSI>(params);
}

#pragma mark - Init

- (void)initialize:(NSString *)casId
   withConsentFlow:(BOOL)withConsentFlow
          testMode:(BOOL)testMode
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
  @try {
    CASManagerBuilder *builder = [CAS buildManager];
    [builder withTestAdMode:testMode];
    
    manager = [builder createWithCasId:casId];
    [CAS setManager:manager];
    
    if (withConsentFlow) {
      consentFlow = [[CASConsentFlow alloc] initWithEnabled:YES];
      [builder withConsentFlow: consentFlow];
    }
    
    interstitial = [[CASInterstitial alloc] initWithCasID:casId];
    rewarded = [[CASRewarded alloc] initWithCasID:casId];
    appOpen = [[CASAppOpen alloc] initWithCasID:casId];
    
    NSLog(@"CASMobileAds initialized (Fabric/TurboModule)");
    
    NSDictionary *config = @{
      @"countryCode": @("country"),
      @"isConsentRequired": @("consentRequired"),
      @"consentFlowStatus": @("consentStatus")
    };
    
    resolve(config);
    
  } @catch (NSException *e) {
    resolve(@{ @"error": e.reason ?: @"Unknown error", @"isConsentRequired": @NO, @"consentFlowStatus": @0 });
  }
}

- (void)isInitialized:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  BOOL initialized = (manager != nil);
  resolve(@(initialized));
}

#pragma mark - Event Emmiter

- (void)startObserving
{
  hasListeners = YES;
}

- (void)stopObserving
{
  hasListeners = NO;
}

#pragma mark - Adaptive Banner

- (void)getAdaptiveBannerHeightForWidth:(double)width
                                resolve:(RCTPromiseResolveBlock)resolve
                                 reject:(RCTPromiseRejectBlock)reject
{
  @try {
    CGFloat containerWidth = (CGFloat)width;
    CASSize *adaptiveSize = [CASSize getAdaptiveBannerForMaxWidth:containerWidth];
    
    if (adaptiveSize) {
      resolve(@(adaptiveSize.height));
    } else {
      resolve(@(50));
    }
  } @catch (NSException *e) {
    reject(@"adaptive_banner_size_error", e.reason, nil);
  }
}



#pragma mark - Mediation Extras

- (void)setMediationExtras:(NSString *)key
                     value:(NSString *)value
                   resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
  @try {
    if (manager) {
      // FIXME: ()
      // [manager setExtraWithKey:key value:value];
    }
    resolve(nil);
  } @catch (NSException *e) {
    reject(@"set_mediation_extras_error", e.reason, nil);
  }
}

#pragma mark - SDK Version

- (void)getSDKVersion:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  resolve([CAS getSDKVersion]);
}

#pragma mark - Test Mode

- (void)setTestMode:(BOOL)enabled
{
  // FIXME: ()
  // [CAS setTestAdMode:enabled];
}

#pragma mark - Settings

- (void)getSettings:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
  if (!CAS.manager || !CAS.settings) {
    resolve(@{});
    return;
  }
  
  CASSettings *settings = CAS.settings;
  
  // FIXME: (contentUrl, keywords, testDeviceIDs)
  resolve(@{
    @"taggedAudience": @(settings.taggedAudience),
    @"age": @(0),
    @"gender": @(0),
    @"contentUrl": @"",
    @"keywords": @[],
    @"debugMode": @(settings.debugMode),
    @"mutedAdSounds": @(settings.mutedAdSounds),
    @"testDeviceIDs": @[],
    @"locationCollectionEnabled": @([CAS.targetingOptions locationCollectionEnabled]),
    @"trialAdFreeInterval": @(settings.trialAdFreeInterval)
  });
}

- (void)setSettings:(JS::NativeCASMobileAdsModule::SpecSetSettingsSettings &)settings
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
  if (!CAS.manager || !CAS.settings) {
    resolve(nil);
    return;
  }

  CASSettings *nativeSettings = CAS.settings;
  
  if (settings.taggedAudience().has_value()) {
    nativeSettings.taggedAudience = (CASAudience)settings.taggedAudience().value();
  }
  if (settings.debugMode().has_value()) {
    nativeSettings.debugMode = settings.debugMode().value();
  }
  if (settings.mutedAdSounds().has_value()) {
    nativeSettings.mutedAdSounds = settings.mutedAdSounds().value();
  }
  if (settings.trialAdFreeInterval().has_value()) {
    nativeSettings.trialAdFreeInterval = settings.trialAdFreeInterval().value();
  }
  if (settings.locationCollectionEnabled().has_value()) {
    [CAS.targetingOptions setLocationCollectionEnabled:settings.locationCollectionEnabled().value()];
  }
  if (settings.testDeviceIDs().has_value()) {    
    FB::LazyVector<NSString *, id> lazyVector = settings.testDeviceIDs().value();
    NSMutableArray<NSString *> *idsArray = [NSMutableArray arrayWithCapacity:lazyVector.size()];
    for (size_t i = 0; i < lazyVector.size(); i++) {
        [idsArray addObject:lazyVector[i]];
    }
    [nativeSettings setTestDeviceWithIds:idsArray];
  }

  resolve(nil);
}



#pragma mark - ConsentFlow

- (void)showConsentFlow:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject
{
  if (!consentFlow.isEnabled) {
    resolve(nil);
    return;
  }
  
  [consentFlow present];
}

- (void)setConsentFlowEnabled:(BOOL)enabled
{
  if (!manager) return;
  consentFlow.isEnabled = enabled;
}


#pragma mark - Interstitial

- (void)isInterstitialAdLoaded:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(@(NO));
    return;
  }
  resolve(@([interstitial isAdLoaded]));
}

- (void)loadInterstitialAd:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
  @try {
    interstitial.delegate = self;
    interstitial.impressionDelegate = self;
    
    [interstitial loadAd];
    resolve(@{@"success": @YES});
    
  } @catch (NSException *e) {
    reject(@"interstitial_load_error", e.reason, nil);
  }
}

- (void)showInterstitialAd:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
  @try {
    if (!interstitial.isAdLoaded) {
      reject(@"not_loaded", @"Interstitial not loaded", nil);
      return;
    }
    
    [interstitial presentFromViewController: nil];
    resolve(@{@"success": @YES});
    
  } @catch (NSException *e) {
    reject(@"interstitial_show_error", e.reason, nil);
  }
}

- (void)setInterstitialAutoloadEnabled:(BOOL)enabled
                               resolve:(nonnull RCTPromiseResolveBlock)resolve
                                reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(nil);
    return;
  }
  interstitial.isAutoloadEnabled = enabled;
  resolve(nil);
}

- (void)setInterstitialAutoshowEnabled:(BOOL)enabled
                               resolve:(nonnull RCTPromiseResolveBlock)resolve
                                reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(nil);
    return;
  }
  interstitial.isAutoshowEnabled = enabled;
  resolve(nil);
}

- (void)setInterstitialMinInterval:(double)seconds
                           resolve:(nonnull RCTPromiseResolveBlock)resolve
                            reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(nil);
    return;
  }
  interstitial.minInterval = seconds;
  resolve(nil);
}

- (void)restartInterstitialInterval:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(nil);
    return;
  }
  [interstitial restartInterval];
  resolve(nil);
}

- (void)destroyInterstitial:(nonnull RCTPromiseResolveBlock)resolve
                     reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (interstitial) {
    [interstitial destroy];
    interstitial = nil;
  }
  resolve(nil);
}


#pragma mark - Rewarded

- (void)isRewardedAdLoaded:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
  if (!rewarded) {
    resolve(@(NO));
    return;
  }
  resolve(@([rewarded isAdLoaded]));
}

- (void)loadRewardedAd:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
{
  @try {
    if (!rewarded) {
      rewarded.delegate = self;
      rewarded.impressionDelegate = self;
    }
    
    [rewarded loadAd];
    resolve(@{@"success": @YES});
    
  } @catch (NSException *e) {
    reject(@"rewarded_load_error", e.reason, nil);
  }
}

- (void)showRewardedAd:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
{
  @try {
    if (!rewarded.isAdLoaded) {
      reject(@"rewarded_show_error", @"Rewarded not loaded", nil);
      return;
    }
    
    [rewarded presentFromViewController: nil userDidEarnRewardHandler:^(CASContentInfo * _Nonnull info) {
      if (self->hasListeners) [self sendEventWithName: CASMobileAdsEventToString(onRewardedCompleted) body:@{}];
      resolve(@{@"success": @YES});
    }];
    
  } @catch (NSException *e) {
    reject(@"rewarded_show_error", e.reason, nil);
  }
}

- (void)setRewardedAutoloadEnabled:(BOOL)enabled
                           resolve:(nonnull RCTPromiseResolveBlock)resolve
                            reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!rewarded) {
    resolve(nil);
    return;
  }
  rewarded.isAutoloadEnabled = enabled;
  resolve(nil);
}

- (void)destroyRewarded:(nonnull RCTPromiseResolveBlock)resolve
                 reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (rewarded) {
    [rewarded destroy];
    rewarded = nil;
  }
  resolve(nil);
}


#pragma mark - AppOpen

- (void)isAppOpenAdLoaded:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject
{
  if (!appOpen) {
    resolve(@(NO));
    return;
  }
  resolve(@([appOpen isAdLoaded]));
}

- (void)loadAppOpenAd:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  @try {
    if (!appOpen) {
      appOpen.delegate = self;
      appOpen.impressionDelegate = self;
    }
    
    [appOpen loadAd];
    resolve(@{@"success": @YES});
    
  } @catch (NSException *e) {
    reject(@"appOpen_load_error", e.reason, nil);
  }
}

- (void)showAppOpenAd:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  @try {
    if (!appOpen.isAdLoaded) {
      reject(@"appOpen_show_error", @"App Open not loaded", nil);
      return;
    }
    
    [appOpen presentFromViewController: nil];
    resolve(@{@"success": @YES});
    
  } @catch (NSException *e) {
    reject(@"appOpen_show_error", e.reason, nil);
  }
}

- (void)setAppOpenAutoloadEnabled:(BOOL)enabled
                          resolve:(nonnull RCTPromiseResolveBlock)resolve
                           reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!appOpen) {
    resolve(nil);
    return;
  }
  appOpen.isAutoloadEnabled = enabled;
  resolve(nil);
}

- (void)setAppOpenAutoshowEnabled:(BOOL)enabled
                          resolve:(nonnull RCTPromiseResolveBlock)resolve
                           reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!appOpen) return;
  appOpen.isAutoshowEnabled = enabled;
  resolve(nil);
}

- (void)destroyAppOpen:(nonnull RCTPromiseResolveBlock)resolve
                reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (appOpen) {
    [appOpen destroy];
    appOpen = nil;
  }
  resolve(nil);
}


#pragma mark - CASScreenContentDelegate

- (void)adDidLoad:(id<CASScreenContent>)ad {
  if (hasListeners) {
    if ([ad isKindOfClass:[CASRewarded class]]) {
      [self sendEventWithName: CASMobileAdsEventToString(onRewardedLoaded) body:@{}];
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
      [self sendEventWithName: CASMobileAdsEventToString(onInterstitialLoaded) body:@{}];
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
      [self sendEventWithName: CASMobileAdsEventToString(onAppOpenLoaded) body:@{}];
    }
  }
}

- (void)adDidFailToLoad:(id<CASScreenContent>)ad error:(CASError *)error {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = CASMobileAdsEventToString(onRewardedLoadFailed);
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = CASMobileAdsEventToString(onInterstitialLoadFailed);
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = CASMobileAdsEventToString(onAppOpenLoadFailed);
  
  [self sendEventWithName:event body:@{@"error": error.description}];
}

- (void)adDidPresent:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = CASMobileAdsEventToString(onRewardedDisplayed);
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = CASMobileAdsEventToString(onInterstitialDisplayed);
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = CASMobileAdsEventToString(onAppOpenDisplayed);
  
  [self sendEventWithName:event body:@{}];
}

- (void)adDidDismiss:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = CASMobileAdsEventToString(onRewardedHidden);
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = CASMobileAdsEventToString(onInterstitialHidden);
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = CASMobileAdsEventToString(onAppOpenHidden);
  
  [self sendEventWithName:event body:@{}];
}

- (void)adDidClick:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = CASMobileAdsEventToString(onRewardedClicked);
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = CASMobileAdsEventToString(onInterstitialClicked);
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = CASMobileAdsEventToString(onAppOpenClicked);
  
  [self sendEventWithName:event body:@{}];
}

- (void)adDidRecordImpressionWithInfo:(CASContentInfo * _Nonnull)info {
  if (!hasListeners) return;
  
  NSMutableDictionary *impressionData = [NSMutableDictionary dictionary];
  if (info.format) {
    impressionData[@"format"] = @{
      @"value": @(info.format.value),
      @"label": info.format.label,
      @"field": info.format.field
    };
  }
  
  impressionData[@"sourceName"] = info.sourceName ?: @"";
  impressionData[@"sourceID"] = @(info.sourceID);
  impressionData[@"sourceUnitID"] = info.sourceUnitID ?: @"";
  
  if (info.creativeID) {
    impressionData[@"creativeID"] = info.creativeID;
  }
  
  impressionData[@"revenue"] = @(info.revenue);
  impressionData[@"revenuePrecision"] = @(info.revenuePrecision);
  impressionData[@"impressionDepth"] = @(info.impressionDepth);
  impressionData[@"revenueTotal"] = @(info.revenueTotal);
  
  NSString *event = @"onAdImpression";
  if ([info.format isEqual:[CASFormat interstitial]]) {
    event = @"onInterstitialImpression";
  } else if ([info.format isEqual:[CASFormat rewarded]]) {
    event = @"onRewardedImpression";
  } else if ([info.format isEqual:[CASFormat appOpen]]) {
    event = @"onAppOpenImpression";
  } else if ([info.format isEqual:[CASFormat banner]] ||
             [info.format isEqual:[CASFormat inlineBanner]] ||
             [info.format isEqual:[CASFormat mediumRectangle]]) {
    event = @"onBannerImpression";
  } else if ([info.format isEqual:[CASFormat native]]) {
    event = @"onNativeImpression";
  }
  
  [self sendEventWithName:event body:impressionData];
}

@end

#endif
