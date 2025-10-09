#import "CASMobileAds.h"
#import "CASMobileAdsConstants.h"
#import <CleverAdsSolutions/CASTypeFlags.h>
#import <CleverAdsSolutions/CASInternalUtils.h>
#import <CleverAdsSolutions/CleverAdsSolutions.h>
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

@implementation CASMobileAds {
  NSString* casIdendifier;
  BOOL hasListeners;
  CASInterstitial *interstitial;
  CASRewarded *rewarded;
  CASAppOpen *appOpen;
  CASConsentFlow *consentFlow;
  CASMediationManager *manager;
}

#ifdef RCT_NEW_ARCH_ENABLED

RCT_EXPORT_MODULE();

#pragma mark - Events

- (NSArray<NSString *> *)supportedEvents {
  return @[
    kOnAppOpenLoaded,
    kOnAppOpenLoadFailed,
    kOnAppOpenDisplayed,
    kOnAppOpenFailedToShow,
    kOnAppOpenHidden,
    kOnAppOpenClicked,
    kOnAppOpenImpression,
    kOnInterstitialLoaded,
    kOnInterstitialLoadFailed,
    kOnInterstitialClicked,
    kOnInterstitialDisplayed,
    kOnInterstitialFailedToShow,
    kOnInterstitialHidden,
    kOnInterstitialImpression,
    kOnRewardedLoaded,
    kOnRewardedLoadFailed,
    kOnRewardedClicked,
    kOnRewardedDisplayed,
    kOnRewardedFailedToShow,
    kOnRewardedHidden,
    kOnRewardedCompleted,
    kOnRewardedImpression,
    kConsentFlowDismissed
  ];
}

#pragma mark - TurboModule Spec Methods

- (std::shared_ptr<TurboModule>)getTurboModule:(const ObjCTurboModule::InitParams &)params
{
  return std::make_shared<NativeCASMobileAdsModuleSpecJSI>(params);
}

#endif

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


#pragma mark - Init

- (void)initializeWithCASId:(NSString *)casId
                    options:(NSDictionary *)options
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject
{
  casIdendifier = casId;
  
  @try {
    CASManagerBuilder *builder = [CAS buildManager];
    
    NSNumber *forceTestAds = options[@"forceTestAds"];
    if (forceTestAds != nil) {
      [builder withTestAdMode:[forceTestAds boolValue]];
    }
    
    NSNumber *showConsent = options[@"showConsentFormIfRequired"];
    if (showConsent != nil && [showConsent boolValue]) {
      consentFlow = [[CASConsentFlow alloc] initWithEnabled:YES];
      
      // Privacy geography
      NSNumber *privacyGeo = options[@"privacyGeography"];
      if (privacyGeo != nil) {
        consentFlow.debugGeography = (CASUserDebugGeography)((NSInteger)[privacyGeo integerValue]);
      }
      
      [builder withConsentFlow:consentFlow];
    }
    
    // Completion handler
    [builder withCompletionHandler:^(CASInitialConfig * _Nonnull config) {
      NSLog(@"CASMobileAds initialized (dual-mode)");
      
      NSDictionary *result = @{
        @"error": config.error ?: [NSNull null],
        @"countryCode": config.countryCode ?: [NSNull null],
        @"isConsentRequired": @(config.isConsentRequired),
        @"consentFlowStatus": @(config.consentFlowStatus)
      };
      
      resolve(result);
    }];
    
    // Create manager and set globally
    manager = [builder createWithCasId:casId];
    [CAS setManager:manager];
    
    // Tagged audience
    NSNumber *audience = options[@"audience"];
    if (audience != nil) {
      CASSettings *nativeSettings = CAS.settings;
      nativeSettings.taggedAudience = (CASAudience)((NSInteger)[audience integerValue]);
    }
    
    // Initialize ad types
    interstitial = [[CASInterstitial alloc] initWithCasID:casId];
    rewarded = [[CASRewarded alloc] initWithCasID:casId];
    appOpen = [[CASAppOpen alloc] initWithCasID:casId];
    
  } @catch (NSException *e) {
    resolve(@{ @"error": e.reason ?: @"Unknown error", @"isConsentRequired": @NO, @"consentFlowStatus": @0 });
  }
}

// TurboModule / New Architecture
#ifdef RCT_NEW_ARCH_ENABLED
- (void)initialize:(nonnull NSString *)casId
           options:(JS::NativeCASMobileAdsModule::SpecInitializeOptions &)options
           resolve:(nonnull RCTPromiseResolveBlock)resolve
            reject:(nonnull RCTPromiseRejectBlock)reject
{
  // Convert SpecInitializeOptions -> NSDictionary
  NSMutableDictionary *dictOptions = [NSMutableDictionary dictionary];
  if (options.forceTestAds().has_value()) {
    dictOptions[@"forceTestAds"] = @(options.forceTestAds().value());
  }
  if (options.showConsentFormIfRequired().has_value()) {
    dictOptions[@"showConsentFormIfRequired"] = @(options.showConsentFormIfRequired().value());
  }
  if (options.privacyGeography().has_value()) {
    dictOptions[@"privacyGeography"] = @(options.privacyGeography().value());
  }
  if (options.audience().has_value()) {
    dictOptions[@"audience"] = @(options.audience().value());
  }
  
  [self initializeWithCASId:casId options:dictOptions resolve:resolve reject:reject];
}

#else
// RCTBridgeModule / Old Architecture
RCT_EXPORT_METHOD(initialize:(NSString *)casId
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self initializeWithCASId:casId options:options resolve:resolve reject:reject];
}

#endif

- (void)isInitializedInternal:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  BOOL initialized = (manager != nil);
  resolve(@(initialized));
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)isInitialized:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  [self isInitializedInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(isInitialized:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self isInitializedInternal:resolve reject:reject];
}
#endif


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

- (void)getSDKVersionInternal:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  resolve([CAS getSDKVersion]);
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)getSDKVersion:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  [self getSDKVersionInternal:resolve reject:reject];
}

#else
RCT_EXPORT_METHOD(getSDKVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self getSDKVersionInternal:resolve reject:reject];
}

#endif

#pragma mark - Consent Flow

- (void)showConsentFlowInternal
{
  if (consentFlow.isEnabled) {
    [consentFlow present];
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)showConsentFlow
{
  [self showConsentFlowInternal];
}
#else
RCT_EXPORT_METHOD(showConsentFlow)
{
  [self showConsentFlowInternal];
}
#endif


#pragma mark - Settings
- (void)setAdSoundsMutedInternal:(BOOL)muted
{
  CASSettings *nativeSettings = CAS.settings;
  nativeSettings.mutedAdSounds = muted;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAdSoundsMuted:(BOOL)muted
{
  [self setAdSoundsMutedInternal:muted];
}

#else
RCT_EXPORT_METHOD(setAdSoundsMuted:(BOOL)muted) {
  [self setAdSoundsMutedInternal:muted];
}
#endif


- (void)setAppContentUrlInternal:(NSString *)contentUrl
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.contentUrl = contentUrl;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAppContentUrl:(NSString *)contentUrl{
  [self setAppContentUrlInternal:contentUrl];
}
#else
RCT_EXPORT_METHOD(setAppContentUrl:(NSString *)contentUrl)
{
  [self setAppContentUrlInternal:contentUrl];
}
#endif


- (void)setAppKeywordsInternal:(NSArray *)keywords
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.keywords = keywords;
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAppKeywords:(NSArray *)keywords
{
  [self setAppKeywordsInternal:keywords];
}
#else
RCT_EXPORT_METHOD(setAppKeywords:(NSArray *)keywords)
{
  [self setAppKeywordsInternal:keywords];
}
#endif


- (void)setDebugLoggingEnabledInternal:(BOOL)enabled
{
  CASSettings *nativeSettings = CAS.settings;
  nativeSettings.debugMode = enabled;
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setDebugLoggingEnabled:(BOOL)enabled
{
  [self setDebugLoggingEnabledInternal:enabled];
}
#else
RCT_EXPORT_METHOD(setDebugLoggingEnabled:(BOOL)enabled)
{
  [self setDebugLoggingEnabledInternal:enabled];
}
#endif


- (void)setTrialAdFreeIntervalInternal:(double)interval
{
  CASSettings *nativeSettings = CAS.settings;
  nativeSettings.trialAdFreeInterval = interval;
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setTrialAdFreeInterval:(double)interval
{
  [self setTrialAdFreeIntervalInternal:interval];
}
#else
RCT_EXPORT_METHOD(setTrialAdFreeInterval:(double)interval)
{
  [self setTrialAdFreeIntervalInternal:interval];
}
#endif


- (void)setUserAgeInternal:(double)age
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.age = age;
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setUserAge:(double)age
{
  [self setUserAgeInternal:age];
}
#else
RCT_EXPORT_METHOD(setUserAge:(double)age)
{
  [self setUserAgeInternal:age];
}
#endif

- (void)setUserGenderInternal:(double)gender
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.gender = (CASGender)((NSInteger)gender);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setUserGender:(double)gender
{
  [self setUserGenderInternal:gender];
}
#else
RCT_EXPORT_METHOD(setUserGender:(double)gender)
{
  [self setUserGenderInternal:gender];
}
#endif


- (void)setLocationCollectionEnabledInternal:(BOOL)enabled
{
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.locationCollectionEnabled = enabled;
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setLocationCollectionEnabled:(BOOL)enabled
{
  [self setLocationCollectionEnabledInternal:enabled];
}
#else
RCT_EXPORT_METHOD(setLocationCollectionEnabled:(BOOL)enabled)
{
  [self setLocationCollectionEnabledInternal:enabled];
}
#endif



#pragma mark - Interstitial

- (void)isInterstitialAdLoadedInternal:(RCTPromiseResolveBlock)resolve
                                reject:(RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(@(NO));
    return;
  }
  resolve(@([interstitial isAdLoaded]));
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)isInterstitialAdLoaded:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject
{
  [self isInterstitialAdLoadedInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(isInterstitialAdLoaded:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self isInterstitialAdLoadedInternal:resolve reject:reject];
}
#endif


- (void)loadInterstitialAdInternal
{
  if (!interstitial) {
    [self sendEventWithName:kOnInterstitialLoadFailed body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  interstitial.delegate = self;
  interstitial.impressionDelegate = self;
  
  [interstitial loadAd];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)loadInterstitialAd
{
  [self loadInterstitialAdInternal];
}
#else
RCT_EXPORT_METHOD(loadInterstitialAd)
{
  [self loadInterstitialAdInternal];
}
#endif


- (void)showInterstitialAdInternal
{
  if (!interstitial) {
    [self sendEventWithName:kOnInterstitialFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  [interstitial presentFromViewController: nil];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)showInterstitialAd
{
  [self showInterstitialAdInternal];
}
#else
RCT_EXPORT_METHOD(showInterstitialAd)
{
  [self showInterstitialAdInternal];
}
#endif


- (void)setInterstitialMinIntervalInternal:(double)seconds
{
  if (interstitial) {
    interstitial.minInterval = seconds;
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setInterstitialMinInterval:(double)seconds
{
  [self setInterstitialMinIntervalInternal:seconds];
}
#else
RCT_EXPORT_METHOD(setInterstitialMinInterval:(double)seconds)
{
  [self setInterstitialMinIntervalInternal:seconds];
}
#endif


- (void)restartInterstitialIntervalInternal
{
  if (interstitial) {
    [interstitial restartInterval];
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)restartInterstitialInterval
{
  [self restartInterstitialIntervalInternal];
}
#else
RCT_EXPORT_METHOD(restartInterstitialInterval)
{
  [self restartInterstitialIntervalInternal];
}
#endif


- (void)setInterstitialAutoloadEnabledInternal:(BOOL)enabled
{
  if (interstitial) {
    interstitial.isAutoloadEnabled = enabled;
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setInterstitialAutoloadEnabled:(BOOL)enabled
{
  [self setInterstitialAutoloadEnabledInternal:enabled];
}
#else
RCT_EXPORT_METHOD(setInterstitialAutoloadEnabled:(BOOL)enabled)
{
  [self setInterstitialAutoloadEnabledInternal:enabled];
}
#endif


- (void)setInterstitialAutoshowEnabledInternal:(BOOL)enabled
{
  if (interstitial) {
    interstitial.isAutoshowEnabled = enabled;
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setInterstitialAutoshowEnabled:(BOOL)enabled
{
  [self setInterstitialAutoshowEnabledInternal:enabled];
}
#else
RCT_EXPORT_METHOD(setInterstitialAutoshowEnabled:(BOOL)enabled)
{
  [self setInterstitialAutoshowEnabledInternal:enabled];
}
#endif


- (void)destroyInterstitialInternal
{
  if (interstitial) {
    [interstitial destroy];
    interstitial = nil;
    
    if (casIdendifier) {
      interstitial = [[CASInterstitial alloc] initWithCasID: casIdendifier];
    }
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)destroyInterstitial
{
  [self destroyInterstitialInternal];
}
#else
RCT_EXPORT_METHOD(destroyInterstitial)
{
  [self destroyInterstitialInternal];
}
#endif


#pragma mark - AppOpen

- (void)isAppOpenAdLoadedInternal:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject
{
  if (!appOpen) {
    resolve(@(NO));
    return;
  }
  resolve(@([appOpen isAdLoaded]));
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)isAppOpenAdLoaded:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject
{
  [self isAppOpenAdLoadedInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(isAppOpenAdLoaded:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self isAppOpenAdLoadedInternal:resolve reject:reject];
}
#endif


- (void)loadAppOpenAdInternal
{
  if (!appOpen) {
    [self sendEventWithName:kOnAppOpenLoadFailed body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  appOpen.delegate = self;
  appOpen.impressionDelegate = self;
  
  [appOpen loadAd];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)loadAppOpenAd
{
  [self loadAppOpenAdInternal];
}
#else
RCT_EXPORT_METHOD(loadAppOpenAd)
{
  [self loadAppOpenAdInternal];
}
#endif


- (void)showAppOpenAdInternal
{
  if (!appOpen) {
    [self sendEventWithName:kOnAppOpenFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  [appOpen presentFromViewController: nil];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)showAppOpenAd
{
  [self showAppOpenAdInternal];
}
#else
RCT_EXPORT_METHOD(showAppOpenAd)
{
  [self showAppOpenAdInternal];
}
#endif


- (void)setAppOpenAutoloadEnabledInternal:(BOOL)enabled
{
  if (appOpen) {
    appOpen.isAutoloadEnabled = enabled;
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAppOpenAutoloadEnabled:(BOOL)enabled
{
  [self setAppOpenAutoloadEnabledInternal:enabled];
}
#else
RCT_EXPORT_METHOD(setAppOpenAutoloadEnabled:(BOOL)enabled)
{
  [self setAppOpenAutoloadEnabledInternal:enabled];
}
#endif


- (void)setAppOpenAutoshowEnabledInternal:(BOOL)enabled
{
  if (appOpen) {
    appOpen.isAutoshowEnabled = enabled;
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAppOpenAutoshowEnabled:(BOOL)enabled
{
  [self setAppOpenAutoshowEnabledInternal:enabled];
}
#else
RCT_EXPORT_METHOD(setAppOpenAutoshowEnabled:(BOOL)enabled)
{
  [self setAppOpenAutoshowEnabledInternal:enabled];
}
#endif


- (void)destroyAppOpenInternal
{
  if (appOpen) {
    [appOpen destroy];
    appOpen = nil;
    
    if (casIdendifier) {
      appOpen = [[CASAppOpen alloc] initWithCasID: casIdendifier];
    }
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)destroyAppOpen
{
  [self destroyAppOpenInternal];
}
#else
RCT_EXPORT_METHOD(destroyAppOpen)
{
  [self destroyAppOpenInternal];
}
#endif


#pragma mark - Rewarded

- (void)isRewardedAdLoadedInternal:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject
{
  if (!rewarded) {
    resolve(@(NO));
    return;
  }
  resolve(@([rewarded isAdLoaded]));
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)isRewardedAdLoaded:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
  [self isRewardedAdLoadedInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(isRewardedAdLoaded:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self isRewardedAdLoadedInternal:resolve reject:reject];
}
#endif


- (void)loadRewardedAdInternal
{
  if (!rewarded) {
    [self sendEventWithName:kOnRewardedLoadFailed body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  rewarded.delegate = self;
  rewarded.impressionDelegate = self;
  
  [rewarded loadAd];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)loadRewardedAd
{
  [self loadRewardedAdInternal];
}
#else
RCT_EXPORT_METHOD(loadRewardedAd)
{
  [self loadRewardedAdInternal];
}
#endif


- (void)showRewardedAdInternal
{
  if (!rewarded) {
    [self sendEventWithName:kOnRewardedFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  [rewarded presentFromViewController: nil userDidEarnRewardHandler:^(CASContentInfo * _Nonnull info) {
    if (self->hasListeners) [self sendEventWithName: kOnRewardedCompleted body:@{}];
  }];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)showRewardedAd
{
  [self showRewardedAdInternal];
}
#else
RCT_EXPORT_METHOD(showRewardedAd)
{
  [self showRewardedAdInternal];
}
#endif


- (void)setRewardedAutoloadEnabledInternal:(BOOL)enabled
{
  if (rewarded) {
    rewarded.isAutoloadEnabled = enabled;
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setRewardedAutoloadEnabled:(BOOL)enabled
{
  [self setRewardedAutoloadEnabledInternal:enabled];
}
#else
RCT_EXPORT_METHOD(setRewardedAutoloadEnabled:(BOOL)enabled)
{
  [self setRewardedAutoloadEnabledInternal];
}
#endif


- (void)destroyRewardedInternal
{
  if (rewarded) {
    [rewarded destroy];
    rewarded = nil;
    
    if (casIdendifier) {
      rewarded = [[CASRewarded alloc] initWithCasID: casIdendifier];
    }
  }
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)destroyRewarded
{
  [self destroyRewardedInternal];
}
#else
RCT_EXPORT_METHOD(destroyRewarded)
{
  [self destroyRewardedInternal];
}
#endif


#pragma mark - CASScreenContentDelegate

- (void)adDidLoad:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedLoaded;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialLoaded;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenLoaded;
  
  [self sendEventWithName:event body:@{}];
}

- (void)adDidFailToLoad:(id<CASScreenContent>)ad error:(CASError *)error {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedLoadFailed;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialLoadFailed;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenLoadFailed;
  
  [self sendEventWithName:event body:@{
    @"errorCode": @(error.code),
    @"errorMessage": error.description}];
}


- (void)adDidPresent:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedDisplayed;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialDisplayed;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenDisplayed;
  
  [self sendEventWithName:event body:@{}];
}


- (void)adDidDismiss:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedHidden;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialHidden;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenHidden;
  
  [self sendEventWithName:event body:@{}];
}


- (void)adDidClick:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedClicked;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialClicked;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenClicked;
  
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
