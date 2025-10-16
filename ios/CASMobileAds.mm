#import "CASMobileAds.h"
#import "CASMobileAdsConstants.h"
#import <CleverAdsSolutions/CASTypeFlags.h>
#import <CleverAdsSolutions/CASInternalUtils.h>
#import <CleverAdsSolutions/CleverAdsSolutions.h>
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

@interface CASMobileAds()
@property (nonatomic, strong) NSString *casIdendifier;
@property (nonatomic, strong) CASConsentFlow *consentFlow;
@property (nonatomic, strong) CASMediationManager *manager;

@property (nonatomic, strong) NSMutableDictionary<NSString *, CASInterstitial *> *interstitialAds;
@property (nonatomic, strong) NSMutableDictionary<NSString *, CASRewarded *> *rewardedAds;
@property (nonatomic, strong) NSMutableDictionary<NSString *, CASAppOpen *> *appOpenAds;

@property (nonatomic, assign) BOOL hasListeners;
@end

@implementation CASMobileAds


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

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<TurboModule>)getTurboModule:(const ObjCTurboModule::InitParams &)params
{
  return std::make_shared<NativeCASMobileAdsModuleSpecJSI>(params);
}
#endif

static CASMobileAds *CASMobileAdsSharedInstance = nil;

+ (instancetype)shared {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        CASMobileAdsSharedInstance = [[self alloc] init];
    });
    return CASMobileAdsSharedInstance;
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


- (instancetype)init
{
    self = [super init];
    if ( self )
    {
      CASMobileAdsSharedInstance = self;
      
      self.interstitialAds = [NSMutableDictionary new];
      self.rewardedAds = [NSMutableDictionary new];
      self.appOpenAds = [NSMutableDictionary new];
    }
    return self;
}

- (void)dealloc {
    NSLog(@"CASMobileAds dealloc: %@", self);
}

#pragma mark - Init

- (void)initializeWithCASId:(NSString *)casId
                    options:(NSDictionary *)options
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject
{
  self.casIdendifier = casId;
  
  @try {
    CASManagerBuilder *builder = [CAS buildManager];
    
    NSNumber *forceTestAds = options[@"forceTestAds"];
    if (forceTestAds != nil) {
      [builder withTestAdMode:[forceTestAds boolValue]];
    }
    
    NSNumber *showConsent = options[@"showConsentFormIfRequired"];
    if (showConsent != nil && [showConsent boolValue]) {
      self.consentFlow = [[CASConsentFlow alloc] initWithEnabled:YES];
      
      // Privacy geography
      NSNumber *privacyGeo = options[@"privacyGeography"];
      if (privacyGeo != nil) {
        self.consentFlow.debugGeography = (CASUserDebugGeography)((NSInteger)[privacyGeo integerValue]);
      }
      
      [builder withConsentFlow: self.consentFlow];
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
    self.manager = [builder createWithCasId:casId];
    [CAS setManager: self.manager];
    
    // Tagged audience
    NSNumber *audience = options[@"audience"];
    if (audience != nil) {
      CASSettings *nativeSettings = CAS.settings;
      nativeSettings.taggedAudience = (CASAudience)((NSInteger)[audience integerValue]);
    }
    
    // Initialize ad types
    CASInterstitial *interstitial = [[CASInterstitial alloc] initWithCasID:casId];
    interstitial.delegate = self;
    interstitial.impressionDelegate = self;
    self.interstitialAds[casId] = interstitial;
    
    CASRewarded *rewarded = [[CASRewarded alloc] initWithCasID:casId];
    rewarded.delegate = self;
    rewarded.impressionDelegate = self;
    self.rewardedAds[casId] = rewarded;
    
    CASAppOpen *appOpen = [[CASAppOpen alloc] initWithCasID:casId];
    appOpen.delegate = self;
    appOpen.impressionDelegate = self;
    self.appOpenAds[casId] = appOpen;
    
  } @catch (NSException *e) {
    resolve(@{ @"error": e.reason ?: @"Unknown error", @"isConsentRequired": @NO, @"consentFlowStatus": @0 });
  }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)initialize:(NSString *)casId
           options:(JS::NativeCASMobileAdsModule::InitializationParams &)options
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
  NSMutableDictionary *dictOptions = [NSMutableDictionary dictionary];
  if (auto val = options.forceTestAds()) {
    dictOptions[@"forceTestAds"] = @(*val);
  }

  if (auto val = options.showConsentFormIfRequired()) {
    dictOptions[@"showConsentFormIfRequired"] = @(*val);
  }
  
  if (auto val = options.debugPrivacyGeography()) {
    dictOptions[@"privacyGeography"] = @(*val);
  }
  
  if (auto val = options.targetAudience()) {
    dictOptions[@"audience"] = @(*val);
  }
  
  if (options.testDeviceIds().has_value()) {
    auto vec = options.testDeviceIds().value();
    NSMutableArray *devices = [NSMutableArray arrayWithCapacity:vec.size()];
    for (size_t i = 0; i < vec.size(); i++) {
      [devices addObject:vec.at(i)];
    }
    dictOptions[@"testDeviceIds"] = devices;
  }
  
  id extras = options.mediationExtras();
  if (extras != nil && [extras isKindOfClass:[NSDictionary class]]) {
    dictOptions[@"mediationExtras"] = (NSDictionary *)extras;
  }
  
  [self initializeWithCASId:casId options:dictOptions resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(initialize:(NSString *)casId
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self initializeWithCASId:casId options:options resolve:resolve reject:reject];
}
#endif

RCT_EXPORT_METHOD(isInitialized:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  BOOL initialized = (self.manager != nil);
  resolve(@(initialized));
}


#pragma mark - Event Emmiter

- (void)startObserving {
  self.hasListeners = YES;
}

- (void)stopObserving {
  self.hasListeners = NO;
}

RCT_EXPORT_METHOD(addListener:(NSString *)eventName) {
    self.hasListeners = YES;
}

RCT_EXPORT_METHOD(removeListeners:(double)count) {
    self.hasListeners = NO;
}


#pragma mark - SDK Version

RCT_EXPORT_METHOD(getSDKVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  resolve([CAS getSDKVersion]);
}


#pragma mark - Consent Flow

RCT_EXPORT_METHOD(showConsentFlow: (nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject) {
  if (self.consentFlow.isEnabled) {
    [self.consentFlow present];
  }
}


#pragma mark - Settings

RCT_EXPORT_METHOD(setAdSoundsMuted:(BOOL)muted) {
  CASSettings *nativeSettings = CAS.settings;
  nativeSettings.mutedAdSounds = muted;
}

RCT_EXPORT_METHOD(setAppContentUrl:(NSString *)contentUrl) {
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.contentUrl = contentUrl;
}

RCT_EXPORT_METHOD(setAppKeywords:(NSArray *)keywords) {
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.keywords = keywords;
}

RCT_EXPORT_METHOD(setDebugLoggingEnabled:(BOOL)enabled) {
  CASSettings *nativeSettings = CAS.settings;
  nativeSettings.debugMode = enabled;
}

RCT_EXPORT_METHOD(setTrialAdFreeInterval:(long)interval) {
  CASSettings *nativeSettings = CAS.settings;
  nativeSettings.trialAdFreeInterval = interval;
}

RCT_EXPORT_METHOD(setUserAge:(long)age) {
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.age = age;
}

RCT_EXPORT_METHOD(setUserGender:(long)gender) {
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.gender = (CASGender)((NSInteger)gender);
}

RCT_EXPORT_METHOD(setLocationCollectionEnabled:(BOOL)enabled) {
  CASTargetingOptions *targetingOptions = CAS.targetingOptions;
  targetingOptions.locationCollectionEnabled = enabled;
}


#pragma mark - Interstitial

RCT_EXPORT_METHOD(isInterstitialAdLoaded:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  CASInterstitial *interstitial = [self retrieveInterstitialForCasId: self.casIdendifier];
  
  if (!interstitial) {
    resolve(@(NO));
    return;
  }
  resolve(@([interstitial isAdLoaded]));
}

RCT_EXPORT_METHOD(loadInterstitialAd) {
  CASInterstitial *interstitial = [self retrieveInterstitialForCasId: self.casIdendifier];
  
  if (!interstitial) {
    [self sendEventWithName:kOnInterstitialLoadFailed body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  [interstitial loadAd];
}

RCT_EXPORT_METHOD(showInterstitialAd) {
  CASInterstitial *interstitial = [self retrieveInterstitialForCasId: self.casIdendifier];
    
  if (!interstitial) {
    [self sendEventWithName:kOnInterstitialFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  [interstitial presentFromViewController: nil];
}

RCT_EXPORT_METHOD(setInterstitialMinInterval:(long)seconds) {
  CASInterstitial *interstitial = [self retrieveInterstitialForCasId: self.casIdendifier];
  if (interstitial) {
    interstitial.minInterval = seconds;
  }
}

RCT_EXPORT_METHOD(restartInterstitialInterval) {
  CASInterstitial *interstitial = [self retrieveInterstitialForCasId: self.casIdendifier];
  if (interstitial) {
    [interstitial restartInterval];
  }
}

RCT_EXPORT_METHOD(setInterstitialAutoloadEnabled:(BOOL)enabled) {
  CASInterstitial *interstitial = [self retrieveInterstitialForCasId: self.casIdendifier];
  if (interstitial) {
    interstitial.isAutoloadEnabled = enabled;
  }
}

RCT_EXPORT_METHOD(setInterstitialAutoshowEnabled:(BOOL)enabled) {
  CASInterstitial *interstitial = [self retrieveInterstitialForCasId: self.casIdendifier];
  if (interstitial) {
    interstitial.isAutoshowEnabled = enabled;
  }
}

RCT_EXPORT_METHOD(destroyInterstitial) {
  CASInterstitial *interstitial = [self retrieveInterstitialForCasId: self.casIdendifier];
  if (interstitial) {
    [interstitial destroy];
    interstitial = nil;
    
    [self.interstitialAds removeObjectForKey:self.casIdendifier];
  }
}


#pragma mark - AppOpen

RCT_EXPORT_METHOD(isAppOpenAdLoaded:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  CASAppOpen *appOpen = [self retrieveAppOpenAdForCasId: self.casIdendifier];
  if (!appOpen) {
    resolve(@(NO));
    return;
  }
  resolve(@([appOpen isAdLoaded]));
}

RCT_EXPORT_METHOD(loadAppOpenAd) {
  CASAppOpen *appOpen = [self retrieveAppOpenAdForCasId: self.casIdendifier];
  if (!appOpen) {
    [self sendEventWithName:kOnAppOpenLoadFailed body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }  
  
  [appOpen loadAd];
}

RCT_EXPORT_METHOD(showAppOpenAd) {
  CASAppOpen *appOpen = [self retrieveAppOpenAdForCasId: self.casIdendifier];
  if (!appOpen) {
    [self sendEventWithName:kOnAppOpenFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  [appOpen presentFromViewController: nil];
}

RCT_EXPORT_METHOD(setAppOpenAutoloadEnabled:(BOOL)enabled)
{
  CASAppOpen *appOpen = [self retrieveAppOpenAdForCasId: self.casIdendifier];
  if (appOpen) {
    appOpen.isAutoloadEnabled = enabled;
  }
}

RCT_EXPORT_METHOD(setAppOpenAutoshowEnabled:(BOOL)enabled)
{
  CASAppOpen *appOpen = [self retrieveAppOpenAdForCasId: self.casIdendifier];
  if (appOpen) {
    appOpen.isAutoshowEnabled = enabled;
  }
}

RCT_EXPORT_METHOD(destroyAppOpen) {
  CASAppOpen *appOpen = [self retrieveAppOpenAdForCasId: self.casIdendifier];
  if (appOpen) {
    [appOpen destroy];
    appOpen = nil;
    
    [self.appOpenAds removeObjectForKey:self.casIdendifier];
  }
}


#pragma mark - Rewarded

RCT_EXPORT_METHOD(isRewardedAdLoaded:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  CASRewarded *rewarded = [self retrieveRewardedAdForCasId: self.casIdendifier];
  if (!rewarded) {
    resolve(@(NO));
    return;
  }
  resolve(@([rewarded isAdLoaded]));
}

RCT_EXPORT_METHOD(loadRewardedAd) {
  CASRewarded *rewarded = [self retrieveRewardedAdForCasId: self.casIdendifier];
  if (!rewarded) {
    [self sendEventWithName:kOnRewardedLoadFailed body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  [rewarded loadAd];
}

RCT_EXPORT_METHOD(showRewardedAd) {
  CASRewarded *rewarded = [self retrieveRewardedAdForCasId: self.casIdendifier];
  if (!rewarded) {
    [self sendEventWithName:kOnRewardedFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    return;
  }
  
  [rewarded presentFromViewController: nil userDidEarnRewardHandler:^(CASContentInfo * _Nonnull info) {
    if (self.hasListeners) [self sendEventWithName: kOnRewardedCompleted body:@{}];
  }];
}

RCT_EXPORT_METHOD(setRewardedAutoloadEnabled:(BOOL)enabled)
{
  CASRewarded *rewarded = [self retrieveRewardedAdForCasId: self.casIdendifier];
  if (rewarded) {
    rewarded.isAutoloadEnabled = enabled;
  }
}

RCT_EXPORT_METHOD(destroyRewarded) {
  CASRewarded *rewarded = [self retrieveRewardedAdForCasId: self.casIdendifier];
  if (rewarded) {
    [rewarded destroy];
    rewarded = nil;
    
    [self.rewardedAds removeObjectForKey:self.casIdendifier];
  }
}


#pragma mark - CASScreenContentDelegate

- (void)screenAdDidLoadContent:(id<CASScreenContent>)ad {
  if (!self.hasListeners) return;
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedLoaded;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialLoaded;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenLoaded;
  [self sendEventWithName:event body:@{}];
}

- (void)screenAd:(id<CASScreenContent>)ad didFailToLoadWithError:(CASError *)error {
  if (!self.hasListeners) return;
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedLoadFailed;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialLoadFailed;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenLoadFailed;
  [self sendEventWithName:event body:@{@"errorCode": @(error.code), @"errorMessage": error.description}];
}

- (void)screenAdWillPresentContent:(id<CASScreenContent>)ad {
  if (!self.hasListeners) return;
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedDisplayed;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialDisplayed;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenDisplayed;
  [self sendEventWithName:event body:@{}];
}

- (void)screenAd:(id<CASScreenContent>)ad didFailToPresentWithError:(CASError *)error {
  if (!self.hasListeners) return;
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedFailedToShow;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialFailedToShow;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenFailedToShow;
  [self sendEventWithName:event body:@{@"errorCode": @(error.code), @"errorMessage": error.description}];
}

- (void)screenAdDidClickContent:(id<CASScreenContent>)ad {
  if (!self.hasListeners) return;
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedClicked;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialClicked;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenClicked;
  [self sendEventWithName:event body:@{}];
}

- (void)screenAdDidDismissContent:(id<CASScreenContent>)ad {
  if (!self.hasListeners) return;
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedHidden;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialHidden;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenHidden;
  [self sendEventWithName:event body:@{}];
}


- (void)adDidRecordImpressionWithInfo:(CASContentInfo * _Nonnull)info {
  if (!self.hasListeners) return;
  
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


#pragma mark - Additional Functions

- (CASInterstitial *)retrieveInterstitialForCasId:(NSString *)casId
{
  CASInterstitial *result = self.interstitialAds[casId];
  if ( !result )
  {
    result = [[CASInterstitial alloc] initWithCasID:casId];
    result.delegate = self;
    result.impressionDelegate = self;
    
    self.interstitialAds[casId] = result;
  }
  
  return result;
}

- (CASRewarded *)retrieveRewardedAdForCasId:(NSString *)casId
{
  CASRewarded *result = self.rewardedAds[casId];
  if ( !result )
  {
    result = [[CASRewarded alloc] initWithCasID:casId];
    result.delegate = self;
    result.impressionDelegate = self;
    
    self.rewardedAds[casId] = result;
  }
  
  return result;
}

- (CASAppOpen *)retrieveAppOpenAdForCasId:(NSString *)casId
{
  CASAppOpen *result = self.appOpenAds[casId];
  if ( !result )
  {
    result = [[CASAppOpen alloc] initWithCasID:casId];
    result.delegate = self;
    result.impressionDelegate = self;
    
    self.appOpenAds[casId] = result;
  }
  
  return result;
}

@end
