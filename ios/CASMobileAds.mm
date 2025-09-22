#import "CASMobileAds.h"

@implementation CASMobileAds {
  BOOL hasListeners;
  NSString *casId;
  CASInterstitial *interstitial;
  CASRewarded *rewarded;
  CASAppOpen *appOpen;
  CASConsentFlow *consentFlow;
  CASMediationManager *manager;
}

RCT_EXPORT_MODULE();

#pragma mark - RCTEventEmitter

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

- (void)startObserving { hasListeners = YES; }
- (void)stopObserving { hasListeners = NO; }

#pragma mark - Init

- (instancetype)init{
  self = [super init];
  
  return self;
}


// `init` requires main queue b/c of UI code
+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

// Invoke all exported methods from main queue
- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(initialize:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    casId = params[@"casId"];
    if (!casId) {
      casId = [[NSBundle mainBundle] bundleIdentifier];
    }
    
    CASManagerBuilder *builder = [CAS buildManager];
    
    if ([params[@"testMode"] boolValue]) {
      [builder withTestAdMode:YES];
    }
    
    if ([params[@"consentFlowEnabled"] boolValue]) {
      consentFlow = [[CASConsentFlow alloc] initWithEnabled:YES];
      [builder withConsentFlow:consentFlow];
    }
    
    manager = [builder createWithCasId:casId];
    [CAS setManager:manager];
    
    interstitial = [[CASInterstitial alloc] initWithCasID:casId];
    rewarded = [[CASRewarded alloc] initWithCasID:casId];
    appOpen = [[CASAppOpen alloc] initWithCasID:casId];
    
    resolve(@{@"success": @YES});
  } @catch (NSException *e) {
    reject(@"init_error", e.reason, nil);
  }
}

RCT_EXPORT_METHOD(isInitialized:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  BOOL initialized = (manager != nil);
  resolve(@(initialized));
}


#pragma mark - Adaptive Banner

RCT_EXPORT_METHOD(getAdaptiveBannerHeightForWidth:(nonnull NSNumber *)width
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    CGFloat containerWidth = [width floatValue];
    
    CASSize *adaptiveSize = [CASSize getAdaptiveBannerForMaxWidth:containerWidth];
    
    if (adaptiveSize) {
      resolve(@(adaptiveSize.height));
    } else {
      resolve(@(50));
    }
  } @catch (NSException *e) {
    reject(@"banner_size_error", e.reason, nil);
  }
}


#pragma mark - Load Ad Methods

RCT_EXPORT_METHOD(loadAppOpenAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    appOpen.delegate = self;
    appOpen.impressionDelegate = self;
    [appOpen loadAd];
    resolve(@{@"success": @YES});
  } @catch (NSException *e) {
    reject(@"load_error", e.reason, nil);
  }
}

RCT_EXPORT_METHOD(loadInterstitialAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    interstitial.delegate = self;
    interstitial.impressionDelegate = self;
    [interstitial loadAd];
    resolve(@{@"success": @YES});
  } @catch (NSException *e) {
    reject(@"load_error", e.reason, nil);
  }
}

RCT_EXPORT_METHOD(loadRewardedAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    rewarded.delegate = self;
    rewarded.impressionDelegate = self;
    [rewarded loadAd];
    resolve(@{@"success": @YES});
  } @catch (NSException *e) {
    reject(@"load_error", e.reason, nil);
  }
}


#pragma mark - Show Ad Methods

RCT_EXPORT_METHOD(showAppOpenAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (!appOpen.isAdLoaded) {
    reject(@"not_loaded", @"AppOpen not loaded", nil);
    return;
  }
  
  [appOpen presentFromViewController:RCTPresentedViewController()];
  resolve(@{@"success": @YES});
}

RCT_EXPORT_METHOD(showInterstitialAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (!interstitial.isAdLoaded) {
    reject(@"not_loaded", @"Interstitial not loaded", nil);
    return;
  }
  
  [interstitial presentFromViewController:RCTPresentedViewController()];
  resolve(@{@"success": @YES});
}


RCT_EXPORT_METHOD(showRewardedAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (!rewarded.isAdLoaded) {
    reject(@"not_loaded", @"Rewarded not loaded", nil);
    return;
  }
  
  [rewarded presentFromViewController:RCTPresentedViewController() userDidEarnRewardHandler:^(CASContentInfo * _Nonnull info) {
    if (hasListeners) [self sendEventWithName:@"onRewardedCompleted" body:@{}];
    resolve(@{@"success": @YES});
  }];
}

#pragma mark - Consent

RCT_EXPORT_METHOD(showConsentFlow:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (!consentFlow.isEnabled) {
    resolve(nil);
    return;
  }
  
  [consentFlow present];
}

RCT_EXPORT_METHOD(setConsentFlowEnabled:(BOOL)enabled)
{
  consentFlow.isEnabled = enabled;
}

#pragma mark - SDK Version / Settings

RCT_EXPORT_METHOD(getSDKVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve([CAS getSDKVersion]);
}

// TODO: comment fix
//RCT_EXPORT_METHOD(getSettings:(RCTPromiseResolveBlock)resolve
//                  rejecter:(RCTPromiseRejectBlock)reject)
//{
//  NSDictionary *settings = [manager settings];
//  resolve(settings);
//}
//
//RCT_EXPORT_METHOD(setSettings:(NSDictionary *)settings
//                  resolver:(RCTPromiseResolveBlock)resolve
//                  rejecter:(RCTPromiseRejectBlock)reject)
//{
//  [manager applySettingsFromDictionary:settings];
//  resolve(nil);
//}

#pragma mark - Test Mode

//RCT_EXPORT_METHOD(setTestMode:(BOOL)enabled)
//{
//  [manager setTestMode:enabled];
//}

#pragma mark - CASScreenContentDelegate

- (void)adDidLoad:(id<CASScreenContent>)ad {
  if (hasListeners) {
    if ([ad isKindOfClass:[CASRewarded class]]) {
      [self sendEventWithName:@"onRewardedLoaded" body:@{}];
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
      [self sendEventWithName:@"onInterstitialLoaded" body:@{}];
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
      [self sendEventWithName:@"onAppOpenLoaded" body:@{}];
    }
  }
}

- (void)adDidFailToLoad:(id<CASScreenContent>)ad error:(CASError *)error {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = @"onRewardedLoadFailed";
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = @"onInterstitialLoadFailed";
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = @"onAppOpenLoadFailed";
  
  [self sendEventWithName:event body:@{@"error": error.description}];
}

- (void)adDidPresent:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = @"onRewardedDisplayed";
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = @"onInterstitialDisplayed";
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = @"onAppOpenDisplayed";
  
  [self sendEventWithName:event body:@{}];
}

- (void)adDidDismiss:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = @"onRewardedHidden";
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = @"onInterstitialHidden";
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = @"onAppOpenHidden";
  
  [self sendEventWithName:event body:@{}];
}

- (void)adDidClick:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = @"onRewardedClicked";
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = @"onInterstitialClicked";
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = @"onAppOpenClicked";
  
  [self sendEventWithName:event body:@{}];
}


// TODO: template fix
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
