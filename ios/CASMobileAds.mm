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

- (void)showConsentFlowInternal:(RCTPromiseResolveBlock)resolve
                          reject:(RCTPromiseRejectBlock)reject
{
    if (!consentFlow.isEnabled) {
        resolve(nil);
        return;
    }
    
    [consentFlow present];
}


#ifdef RCT_NEW_ARCH_ENABLED
- (void)showConsentFlow:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
    [self showConsentFlowInternal:resolve reject:reject];
}

#else

RCT_EXPORT_METHOD(showConsentFlow:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [self showConsentFlowInternal:resolve reject:reject];
}

#endif


#pragma mark - Settings
- (void)setAdSoundsMutedInternal:(BOOL)muted
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject {
    CASSettings *nativeSettings = CAS.settings;
    nativeSettings.mutedAdSounds = muted;
    resolve(nil);
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAdSoundsMuted:(BOOL)muted
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
    [self setAdSoundsMutedInternal:muted resolve:resolve reject:reject];
}

#else
RCT_EXPORT_METHOD(setAdSoundsMuted:(BOOL)muted
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject) {
    [self setAdSoundsMutedInternal:muted resolve:resolve reject:reject];
}
#endif


- (void)setAppContentUrlInternal:(NSString *)contentUrl
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject {
    CASTargetingOptions *targetingOptions = CAS.targetingOptions;
    targetingOptions.contentUrl = contentUrl;
    resolve(nil);
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAppContentUrl:(NSString *)contentUrl
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
    [self setAppContentUrlInternal:contentUrl resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setAppContentUrl:(NSString *)contentUrl
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject) {
    [self setAppContentUrlInternal:contentUrl resolve:resolve reject:reject];
}
#endif


- (void)setAppKeywordsInternal:(NSArray *)keywords
                        resolve:(RCTPromiseResolveBlock)resolve
                         reject:(RCTPromiseRejectBlock)reject {
    CASTargetingOptions *targetingOptions = CAS.targetingOptions;
    targetingOptions.keywords = keywords;
    resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAppKeywords:(NSArray *)keywords
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
    [self setAppKeywordsInternal:keywords resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setAppKeywords:(NSArray *)keywords
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject) {
    [self setAppKeywordsInternal:keywords resolve:resolve reject:reject];
}
#endif


- (void)setDebugLoggingEnabledInternal:(BOOL)enabled
                               resolve:(RCTPromiseResolveBlock)resolve
                                reject:(RCTPromiseRejectBlock)reject {
    CASSettings *nativeSettings = CAS.settings;
    nativeSettings.debugMode = enabled;
    resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setDebugLoggingEnabled:(BOOL)enabled
                       resolve:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject {
    [self setDebugLoggingEnabledInternal:enabled resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setDebugLoggingEnabled:(BOOL)enabled
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject) {
    [self setDebugLoggingEnabledInternal:enabled resolve:resolve reject:reject];
}
#endif


- (void)setTrialAdFreeIntervalInternal:(double)interval
                                resolve:(RCTPromiseResolveBlock)resolve
                                 reject:(RCTPromiseRejectBlock)reject {
    CASSettings *nativeSettings = CAS.settings;
    nativeSettings.trialAdFreeInterval = interval;
    resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setTrialAdFreeInterval:(double)interval
                       resolve:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject {
    [self setTrialAdFreeIntervalInternal:interval resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setTrialAdFreeInterval:(double)interval
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject) {
    [self setTrialAdFreeIntervalInternal:interval resolve:resolve reject:reject];
}
#endif


- (void)setUserAgeInternal:(double)age
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject {
    CASTargetingOptions *targetingOptions = CAS.targetingOptions;
    targetingOptions.age = age;
    resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setUserAge:(double)age
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    [self setUserAgeInternal:age resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setUserAge:(double)age
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject) {
    [self setUserAgeInternal:age resolve:resolve reject:reject];
}
#endif

- (void)setUserGenderInternal:(double)gender
                       resolve:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject {
    CASTargetingOptions *targetingOptions = CAS.targetingOptions;
    targetingOptions.gender = (CASGender)((NSInteger)gender);
    resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setUserGender:(double)gender
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
    [self setUserGenderInternal:gender resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setUserGender:(double)gender
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject) {
    [self setUserGenderInternal:gender resolve:resolve reject:reject];
}
#endif


- (void)setLocationCollectionEnabledInternal:(BOOL)enabled
                                     resolve:(RCTPromiseResolveBlock)resolve
                                      reject:(RCTPromiseRejectBlock)reject {
    CASTargetingOptions *targetingOptions = CAS.targetingOptions;
    targetingOptions.locationCollectionEnabled = enabled;
    resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setLocationCollectionEnabled:(BOOL)enabled
                             resolve:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject {
    [self setLocationCollectionEnabledInternal:enabled resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setLocationCollectionEnabled:(BOOL)enabled
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject) {
    [self setLocationCollectionEnabledInternal:enabled resolve:resolve reject:reject];
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


- (void)loadInterstitialAdInternal:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject
{
  @try {
    if (!interstitial) {
      [self sendEventWithName:kOnInterstitialLoadFailed body:@{
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
#ifdef RCT_NEW_ARCH_ENABLED
- (void)loadInterstitialAd:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
  [self loadInterstitialAdInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(loadInterstitialAd:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self loadInterstitialAdInternal:resolve reject:reject];
}
#endif


- (void)showInterstitialAdInternal:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    [self sendEventWithName:kOnInterstitialFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    resolve(@{@"success": @YES});
    return;
  }
  
  [interstitial presentFromViewController: nil];
  // resolve(@{@"success": @YES});
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)showInterstitialAd:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
  [self showInterstitialAdInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(showInterstitialAd:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self showInterstitialAdInternal:resolve reject:reject];
}
#endif


- (void)setInterstitialMinIntervalInternal:(double)seconds
                                   resolve:(RCTPromiseResolveBlock)resolve
                                    reject:(RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(nil);
    return;
  }
  interstitial.minInterval = seconds;
  resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setInterstitialMinInterval:(double)seconds
                           resolve:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject
{
  [self setInterstitialMinIntervalInternal:seconds resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setInterstitialMinInterval:(double)seconds
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self setInterstitialMinIntervalInternal:seconds resolve:resolve reject:reject];
}
#endif


- (void)restartInterstitialIntervalInternal:(RCTPromiseResolveBlock)resolve
                                     reject:(RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(nil);
    return;
  }
  [interstitial restartInterval];
  resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)restartInterstitialInterval:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject
{
  [self restartInterstitialIntervalInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(restartInterstitialInterval:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self restartInterstitialIntervalInternal:resolve reject:reject];
}
#endif


- (void)setInterstitialAutoloadEnabledInternal:(BOOL)enabled
                                       resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(nil);
    return;
  }
  interstitial.isAutoloadEnabled = enabled;
  resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setInterstitialAutoloadEnabled:(BOOL)enabled
                               resolve:(RCTPromiseResolveBlock)resolve
                                reject:(RCTPromiseRejectBlock)reject
{
  [self setInterstitialAutoloadEnabledInternal:enabled resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setInterstitialAutoloadEnabled:(BOOL)enabled
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self setInterstitialAutoloadEnabledInternal:enabled resolve:resolve reject:reject];
}
#endif


- (void)setInterstitialAutoshowEnabledInternal:(BOOL)enabled
                                       resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject
{
  if (!interstitial) {
    resolve(nil);
    return;
  }
  interstitial.isAutoshowEnabled = enabled;
  resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setInterstitialAutoshowEnabled:(BOOL)enabled
                               resolve:(nonnull RCTPromiseResolveBlock)resolve
                                reject:(nonnull RCTPromiseRejectBlock)reject
{
  [self setInterstitialAutoshowEnabledInternal:enabled resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setInterstitialAutoshowEnabled:(BOOL)enabled
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self setInterstitialAutoshowEnabledInternal:enabled resolve:resolve reject:reject];
}
#endif


- (void)destroyInterstitialInternal:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject
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
#ifdef RCT_NEW_ARCH_ENABLED
- (void)destroyInterstitial:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject
{
  [self destroyInterstitialInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(destroyInterstitial:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self destroyInterstitialInternal:resolve reject:reject];
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


- (void)loadAppOpenAdInternal:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  @try {
    if (!appOpen) {
      [self sendEventWithName:kOnAppOpenLoadFailed body:@{
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
#ifdef RCT_NEW_ARCH_ENABLED
- (void)loadAppOpenAd:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  [self loadAppOpenAdInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(loadAppOpenAd:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self loadAppOpenAdInternal:resolve reject:reject];
}
#endif


- (void)showAppOpenAdInternal:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  if (!appOpen) {
    [self sendEventWithName:kOnAppOpenFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    resolve(@{@"success": @YES});
    return;
  }
  
  [appOpen presentFromViewController: nil];
  resolve(@{@"success": @YES});
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)showAppOpenAd:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  [self showAppOpenAdInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(showAppOpenAd:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self showAppOpenAdInternal:resolve reject:reject];
}
#endif


- (void)setAppOpenAutoloadEnabledInternal:(BOOL)enabled
                                  resolve:(RCTPromiseResolveBlock)resolve
                                   reject:(RCTPromiseRejectBlock)reject
{
  if (!appOpen) {
    resolve(nil);
    return;
  }
  appOpen.isAutoloadEnabled = enabled;
  resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAppOpenAutoloadEnabled:(BOOL)enabled
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject
{
  [self setAppOpenAutoloadEnabledInternal:enabled resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setAppOpenAutoloadEnabled:(BOOL)enabled
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self setAppOpenAutoloadEnabledInternal:enabled resolve:resolve reject:reject];
}
#endif


- (void)setAppOpenAutoshowEnabledInternal:(BOOL)enabled
                                  resolve:(RCTPromiseResolveBlock)resolve
                                   reject:(RCTPromiseRejectBlock)reject
{
  if (!appOpen) {
    resolve(nil);
    return;
  }
  appOpen.isAutoshowEnabled = enabled;
  resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setAppOpenAutoshowEnabled:(BOOL)enabled
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject
{
  [self setAppOpenAutoshowEnabledInternal:enabled resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setAppOpenAutoshowEnabled:(BOOL)enabled
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self setAppOpenAutoshowEnabledInternal:enabled resolve:resolve reject:reject];
}
#endif


- (void)destroyAppOpenInternal:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject
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
#ifdef RCT_NEW_ARCH_ENABLED
- (void)destroyAppOpen:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
{
  [self destroyAppOpenInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(destroyAppOpen:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self destroyAppOpenInternal:resolve reject:reject];
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


- (void)loadRewardedAdInternal:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject
{
  @try {
    if (!rewarded) {
      [self sendEventWithName:kOnRewardedLoadFailed body:@{
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
#ifdef RCT_NEW_ARCH_ENABLED
- (void)loadRewardedAd:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
{
    [self loadRewardedAdInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(loadRewardedAd:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [self loadRewardedAdInternal:resolve reject:reject];
}
#endif


- (void)showRewardedAdInternal:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject
{
  if (!rewarded) {
    [self sendEventWithName:kOnRewardedFailedToShow body:@{
      @"errorCode": @(CASError.notInitialized.code),
      @"errorMessage": CASError.notInitialized.description}];
    resolve(@{@"success": @YES});
    return;
  }
  
  [rewarded presentFromViewController: nil userDidEarnRewardHandler:^(CASContentInfo * _Nonnull info) {
    if (self->hasListeners) [self sendEventWithName: kOnRewardedCompleted body:@{}];
  }];
   
  resolve(@{@"success": @YES});
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)showRewardedAd:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
{
    [self showRewardedAdInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(showRewardedAd:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [self showRewardedAdInternal:resolve reject:reject];
}
#endif


- (void)setRewardedAutoloadEnabledInternal:(BOOL)enabled
                                   resolve:(RCTPromiseResolveBlock)resolve
                                    reject:(RCTPromiseRejectBlock)reject
{
  if (!rewarded) {
    resolve(nil);
    return;
  }
  rewarded.isAutoloadEnabled = enabled;
  resolve(nil);
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setRewardedAutoloadEnabled:(BOOL)enabled
                           resolve:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject
{
    [self setRewardedAutoloadEnabledInternal:enabled resolve:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(setRewardedAutoloadEnabled:(BOOL)enabled
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [self setRewardedAutoloadEnabledInternal:enabled resolve:resolve reject:reject];
}
#endif


- (void)destroyRewardedInternal:(RCTPromiseResolveBlock)resolve
                         reject:(RCTPromiseRejectBlock)reject
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
#ifdef RCT_NEW_ARCH_ENABLED
- (void)destroyRewarded:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject
{
    [self destroyRewardedInternal:resolve reject:reject];
}
#else
RCT_EXPORT_METHOD(destroyRewarded:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [self destroyRewardedInternal:resolve reject:reject];
}
#endif


#pragma mark - CASScreenContentDelegate

- (void)adDidLoadInternal:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedLoaded;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialLoaded;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenLoaded;
  
  [self sendEventWithName:event body:@{}];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)adDidLoad:(id<CASScreenContent>)ad {
    [self adDidLoadInternal:ad];
}
#else
- (void)adDidLoad:(id<CASScreenContent>)ad {
    [self adDidLoadInternal:ad];
}
#endif


- (void)adDidFailToLoadInternal:(id<CASScreenContent>)ad error:(CASError *)error {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedLoadFailed;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialLoadFailed;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenLoadFailed;
  
  [self sendEventWithName:event body:@{
    @"errorCode": @(error.code),
    @"errorMessage": error.description}];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)adDidFailToLoad:(id<CASScreenContent>)ad error:(CASError *)error {
    [self adDidFailToLoadInternal:ad error:error];
}
#else
- (void)adDidFailToLoad:(id<CASScreenContent>)ad error:(CASError *)error {
    [self adDidFailToLoadInternal:ad error:error];
}
#endif


- (void)adDidPresentInternal:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedDisplayed;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialDisplayed;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenDisplayed;
  
  [self sendEventWithName:event body:@{}];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)adDidPresent:(id<CASScreenContent>)ad {
    [self adDidPresentInternal:ad];
}
#else
- (void)adDidPresent:(id<CASScreenContent>)ad {
    [self adDidPresentInternal:ad];
}
#endif


- (void)adDidDismissInternal:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedHidden;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialHidden;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenHidden;
  
  [self sendEventWithName:event body:@{}];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)adDidDismiss:(id<CASScreenContent>)ad {
    [self adDidDismissInternal:ad];
}
#else
- (void)adDidDismiss:(id<CASScreenContent>)ad {
    [self adDidDismissInternal:ad];
}
#endif


- (void)adDidClickInternal:(id<CASScreenContent>)ad {
  if (!hasListeners) return;
  
  NSString *event = @"";
  if ([ad isKindOfClass:[CASRewarded class]]) event = kOnRewardedClicked;
  else if ([ad isKindOfClass:[CASInterstitial class]]) event = kOnInterstitialClicked;
  else if ([ad isKindOfClass:[CASAppOpen class]]) event = kOnAppOpenClicked;
  
  [self sendEventWithName:event body:@{}];
}
#ifdef RCT_NEW_ARCH_ENABLED
- (void)adDidClick:(id<CASScreenContent>)ad {
    [self adDidClickInternal:ad];
}
#else
- (void)adDidClick:(id<CASScreenContent>)ad {
    [self adDidClickInternal:ad];
}
#endif


- (void)adDidRecordImpressionWithInfoInternal:(CASContentInfo * _Nonnull)info {
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
#ifdef RCT_NEW_ARCH_ENABLED
- (void)adDidRecordImpressionWithInfo:(CASContentInfo * _Nonnull)info {
    [self adDidRecordImpressionWithInfoInternal:info];
}
#else
- (void)adDidRecordImpressionWithInfo:(CASContentInfo * _Nonnull)info {
    [self adDidRecordImpressionWithInfoInternal:info];
}
#endif


@end
