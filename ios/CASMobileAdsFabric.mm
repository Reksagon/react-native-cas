#import "CASMobileAds.h"
#import <CleverAdsSolutions/CASTypeFlags.h>
#import <CleverAdsSolutions/CASInternalUtils.h>
#import <CleverAdsSolutions/CleverAdsSolutions.h>
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>

using namespace facebook::react;

@implementation CASMobileAds {
  NSString* casIdendifier;
  BOOL hasListeners;
  CASInterstitial *interstitial;
  CASRewarded *rewarded;
  CASAppOpen *appOpen;
  CASConsentFlow *consentFlow;
  CASMediationManager *manager;
}

#define konAppOpenLoaded @"onAppOpenLoaded"
#define konAppOpenLoadFailed @"onAppOpenLoadFailed"
#define konAppOpenDisplayed @"onAppOpenDisplayed"
#define konAppOpenFailedToShow @"onAppOpenFailedToShow"
#define konAppOpenHidden @"onAppOpenHidden"
#define konAppOpenClicked @"onAppOpenClicked"
#define konAppOpenImpression @"onAppOpenImpression"
#define konInterstitialLoaded @"onInterstitialLoaded"
#define konInterstitialLoadFailed @"onInterstitialLoadFailed"
#define konInterstitialClicked @"onInterstitialClicked"
#define konInterstitialDisplayed @"onInterstitialDisplayed"
#define konInterstitialFailedToShow @"onInterstitialFailedToShow"
#define konInterstitialHidden @"onInterstitialHidden"
#define konInterstitialImpression @"onInterstitialImpression"
#define konRewardedLoaded @"onRewardedLoaded"
#define konRewardedLoadFailed @"onRewardedLoadFailed"
#define konRewardedClicked @"onRewardedClicked"
#define konRewardedDisplayed @"onRewardedDisplayed"
#define konRewardedFailedToShow @"onRewardedFailedToShow"
#define konRewardedHidden @"onRewardedHidden"
#define konRewardedCompleted @"onRewardedCompleted"
#define konRewardedImpression @"onRewardedImpression"
#define kconsentFlowDismissed @"consentFlowDismissed"


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

- (void)initialize:(nonnull NSString *)casId
           options:(JS::NativeCASMobileAdsModule::SpecInitializeOptions &)options
           resolve:(nonnull RCTPromiseResolveBlock)resolve
            reject:(nonnull RCTPromiseRejectBlock)reject {
  casIdendifier = casId;
  
  @try {
    CASManagerBuilder *builder = [CAS buildManager];
    [builder withTestAdMode:options.forceTestAds().value()];
        
    if (options.showConsentFormIfRequired().value()) {
      consentFlow = [[CASConsentFlow alloc] initWithEnabled:YES];
      [builder withConsentFlow: consentFlow];
    }
    [builder withCompletionHandler:^(CASInitialConfig * _Nonnull config) {
      NSLog(@"CASMobileAds initialized (Fabric/TurboModule)");
      
      NSDictionary *result = @{
        @"error":config.error,
        @"countryCode": config.countryCode,
        @"isConsentRequired": @(config.isConsentRequired),
        @"consentFlowStatus": @(config.consentFlowStatus)
      };
      
      resolve(config);
    }];
    
    manager = [builder createWithCasId:casId];
    [CAS setManager:manager];
    
    if (options.audience().value()) {
      CASSettings *nativeSettings = CAS.settings;
      nativeSettings.taggedAudience = (CASAudience)((NSInteger)options.audience().value());
    }
        
    interstitial = [[CASInterstitial alloc] initWithCasID:casId];
    rewarded = [[CASRewarded alloc] initWithCasID:casId];
    appOpen = [[CASAppOpen alloc] initWithCasID:casId];
    
  } @catch (NSException *e) {
    resolve(@{ @"error": e.reason ?: @"Unknown error", @"isConsentRequired": @NO, @"consentFlowStatus": @0 });
  }
}

- (void)isInitialized:(nonnull RCTPromiseResolveBlock)resolve
               reject:(nonnull RCTPromiseRejectBlock)reject {
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


#pragma mark - SDK Version

- (void)getSDKVersion:(nonnull RCTPromiseResolveBlock)resolve
               reject:(nonnull RCTPromiseRejectBlock)reject
{
  resolve([CAS getSDKVersion]);
}


#pragma mark - ConsentFlow

- (void)showConsentFlow:(nonnull RCTPromiseResolveBlock)resolve
                 reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!consentFlow.isEnabled) {
    resolve(nil);
    return;
  }
  
  [consentFlow present];
}


#pragma mark - Settings

- (void)setAdSoundsMuted:(BOOL)muted
                 resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject {
  CASSettings *nativeSettings = CAS.settings;
  nativeSettings.mutedAdSounds = muted;
  resolve(nil);
}

- (void)setAppContentUrl:(nonnull NSString *)contentUrl
                 resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.contentUrl = contentUrl;
  resolve(nil);
}

- (void)setAppKeywords:(nonnull NSArray *)keywords
               resolve:(nonnull RCTPromiseResolveBlock)resolve
                reject:(nonnull RCTPromiseRejectBlock)reject
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.keywords = keywords;
  resolve(nil);
}

- (void)setDebugLoggingEnabled:(BOOL)enabled
                       resolve:(nonnull RCTPromiseResolveBlock)resolve
                        reject:(nonnull RCTPromiseRejectBlock)reject
{
  CASSettings *nativeSettings = CAS.settings;
  nativeSettings.debugMode = enabled;
  resolve(nil);
}

- (void)setTrialAdFreeInterval:(double)interval
                       resolve:(nonnull RCTPromiseResolveBlock)resolve
                        reject:(nonnull RCTPromiseRejectBlock)reject
{
  CASSettings *nativeSettings = CAS.settings;
  nativeSettings.trialAdFreeInterval = interval;
  resolve(nil);
}

- (void)setUserAge:(double)age
           resolve:(nonnull RCTPromiseResolveBlock)resolve
            reject:(nonnull RCTPromiseRejectBlock)reject
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.age = age;
  resolve(nil);
}

- (void)setUserGender:(double)gender
              resolve:(nonnull RCTPromiseResolveBlock)resolve
               reject:(nonnull RCTPromiseRejectBlock)reject
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.gender = (CASGender)((NSInteger)gender);
  resolve(nil);
}

- (void)setLocationCollectionEnabled:(BOOL)enabled
                             resolve:(nonnull RCTPromiseResolveBlock)resolve
                              reject:(nonnull RCTPromiseRejectBlock)reject
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.locationCollectionEnabled = enabled;
  resolve(nil);
}


#pragma mark - Interstitial

- (void)isInterstitialAdLoaded:(nonnull RCTPromiseResolveBlock)resolve
                        reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(@(NO));
    return;
  }
  resolve(@([interstitial isAdLoaded]));
}

- (void)loadInterstitialAd:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject
{
  @try {
    if (!interstitial) {
      [self sendEventWithName:konInterstitialLoadFailed body:@{
        @"errorCode": @(CASError.notInitialized.code),
        @"errorMessage": CASError.notInitialized.description}];
      resolve(@{@"success": @YES});
      return;
    }
    
    interstitial.delegate = self;
    interstitial.impressionDelegate = self;
    
    [interstitial loadAd];
    resolve(@{@"success": @YES});
    
  } @catch (NSException *e) {
    reject(@"interstitial_load_error", e.reason, nil);
  }
}

- (void)showInterstitialAd:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    [self sendEventWithName:konInterstitialFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    resolve(@{@"success": @YES});
    return;
  }
  
  [interstitial presentFromViewController: nil];
  resolve(@{@"success": @YES});
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

- (void)restartInterstitialInterval:(nonnull RCTPromiseResolveBlock)resolve
                             reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(nil);
    return;
  }
  [interstitial restartInterval];
  resolve(nil);
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

- (void)destroyInterstitial:(nonnull RCTPromiseResolveBlock)resolve
                     reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (interstitial) {
    [interstitial destroy];
    interstitial = nil;
    
    if (casIdendifier) {
      interstitial = [[CASInterstitial alloc] initWithCasID: casIdendifier];
    }
  }
  resolve(nil);
}


#pragma mark - AppOpen

- (void)isAppOpenAdLoaded:(nonnull RCTPromiseResolveBlock)resolve
                   reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!appOpen) {
    resolve(@(NO));
    return;
  }
  resolve(@([appOpen isAdLoaded]));
}

- (void)loadAppOpenAd:(nonnull RCTPromiseResolveBlock)resolve
               reject:(nonnull RCTPromiseRejectBlock)reject
{
  @try {
    if (!appOpen) {
      [self sendEventWithName:konAppOpenLoadFailed body:@{
        @"errorCode": @(CASError.notInitialized.code),
        @"errorMessage": CASError.notInitialized.description}];
      resolve(@{@"success": @YES});
      return;
    }
    
    appOpen.delegate = self;
    appOpen.impressionDelegate = self;
    
    [appOpen loadAd];
    resolve(@{@"success": @YES});
    
  } @catch (NSException *e) {
    reject(@"appOpen_load_error", e.reason, nil);
  }
}

- (void)showAppOpenAd:(nonnull RCTPromiseResolveBlock)resolve
               reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!appOpen) {
    [self sendEventWithName:konAppOpenFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    resolve(@{@"success": @YES});
    return;
  }
  
  [appOpen presentFromViewController: nil];
  resolve(@{@"success": @YES});
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
  if (!appOpen) {
    resolve(nil);
    return;
  }
  appOpen.isAutoshowEnabled = enabled;
  resolve(nil);
}

- (void)destroyAppOpen:(nonnull RCTPromiseResolveBlock)resolve
                reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (appOpen) {
    [appOpen destroy];
    appOpen = nil;
    
    if (casIdendifier) {
      appOpen = [[CASAppOpen alloc] initWithCasID: casIdendifier];
    }
  }
  resolve(nil);
}


#pragma mark - Rewarded

- (void)isRewardedAdLoaded:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!rewarded) {
    resolve(@(NO));
    return;
  }
  resolve(@([rewarded isAdLoaded]));
}

- (void)loadRewardedAd:(nonnull RCTPromiseResolveBlock)resolve
                reject:(nonnull RCTPromiseRejectBlock)reject
{
  @try {
    if (!rewarded) {
      [self sendEventWithName:konRewardedLoadFailed body:@{
        @"errorCode": @(CASError.notInitialized.code),
        @"errorMessage": CASError.notInitialized.description}];
      resolve(@{@"success": @YES});
      return;
    }
    
    rewarded.delegate = self;
    rewarded.impressionDelegate = self;
    
    [rewarded loadAd];
    resolve(@{@"success": @YES});
    
  } @catch (NSException *e) {
    reject(@"rewarded_load_error", e.reason, nil);
  }
}

- (void)showRewardedAd:(nonnull RCTPromiseResolveBlock)resolve
                reject:(nonnull RCTPromiseRejectBlock)reject
{
  if (!rewarded) {
    [self sendEventWithName:konRewardedFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    resolve(@{@"success": @YES});
    return;
  }
  
  [rewarded presentFromViewController: nil userDidEarnRewardHandler:^(CASContentInfo * _Nonnull info) {
    if (self->hasListeners) [self sendEventWithName: konRewardedCompleted body:@{}];
  }];
   
  resolve(@{@"success": @YES});
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
    
    if (casIdendifier) {
      rewarded = [[CASRewarded alloc] initWithCasID: casIdendifier];
    }
  }
  resolve(nil);
}


#pragma mark - CASScreenContentDelegate

- (void)adDidLoad:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = konRewardedLoaded;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = konInterstitialLoaded;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = konAppOpenLoaded;
  
  [self sendEventWithName:event body:@{}];
}

- (void)adDidFailToLoad:(id<CASScreenContent>)ad error:(CASError *)error {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = konRewardedLoadFailed;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = konInterstitialLoadFailed;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = konAppOpenLoadFailed;
  
  [self sendEventWithName:event body:@{
    @"errorCode": @(error.code),
    @"errorMessage": error.description}];
}

- (void)adDidPresent:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = konRewardedDisplayed;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = konInterstitialDisplayed;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = konAppOpenDisplayed;
  
  [self sendEventWithName:event body:@{}];
}

- (void)adDidDismiss:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = konRewardedHidden;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = konInterstitialHidden;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = konAppOpenHidden;
  
  [self sendEventWithName:event body:@{}];
}

- (void)adDidClick:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = konRewardedClicked;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = konInterstitialClicked;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = konAppOpenClicked;
  
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
