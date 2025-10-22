#import <CleverAdsSolutions/CASInternalUtils.h>
#import <CleverAdsSolutions/CASTypeFlags.h>
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>
#import <CleverAdsSolutions/CleverAdsSolutions.h>
#import "CASMobileAds.h"
#import "CASMobileAdsConstants.h"

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

@interface CASMobileAds ()
@property (nonatomic, strong) NSString *casIdendifier;

@property (nonatomic, strong, nullable) NSMutableDictionary *casInitConfig;
@property (nonatomic, strong, nullable) CASInterstitial *interstitialAds;
@property (nonatomic, strong, nullable) CASRewarded *rewardedAds;
@property (nonatomic, strong, nullable) CASAppOpen *appOpenAds;

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

+ (NSDictionary *)convertImpressionInfo:(CASContentInfo *)info {
    NSMutableDictionary *impressionData = [NSMutableDictionary dictionary];

    NSString *precision = @"";

    switch (info.revenuePrecision) {
        case CASRevenuePrecisionPrecise:
            precision = @"precise";
            break;

        case CASRevenuePrecisionFloor:
            precision =  @"floor";
            break;

        case CASRevenuePrecisionEstimated:
            precision =  @"estimated";
            break;

        default:
            precision =  @"unknown";
            break;
    }

    impressionData[@"format"] = info.format.label;
    impressionData[@"sourceName"] = info.sourceName;
    impressionData[@"sourceUnitId"] = info.sourceUnitID;
    impressionData[@"revenue"] = @(info.revenue);
    impressionData[@"revenuePrecision"] = precision;
    impressionData[@"impressionDepth"] = @(info.impressionDepth);
    impressionData[@"revenueTotal"] = @(info.revenueTotal);

    if (info.creativeID) {
        impressionData[@"creativeId"] = info.creativeID;
    }

    return impressionData;
}

+ (instancetype)shared {
    static dispatch_once_t onceToken;
    static CASMobileAds *instance;

    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
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

    return self;
}

#pragma mark - Init

RCT_EXPORT_METHOD(initialize:(NSString *)casId
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (self.casInitConfig && self.casIdendifier == casId) {
        resolve(self.casInitConfig);
        return;
    }

    self.casIdendifier = casId;

    // Tagged audience
    NSNumber *audience = options[@"targetAudience"];

    if (audience != nil) {
        CAS.settings.taggedAudience = (CASAudience)[audience integerValue];
    }

    // Initialize ad types
    CASInterstitial *interstitial = [[CASInterstitial alloc] initWithCasID:casId];
    interstitial.delegate = self;
    interstitial.impressionDelegate = self;
    self.interstitialAds = interstitial;

    CASRewarded *rewarded = [[CASRewarded alloc] initWithCasID:casId];
    rewarded.delegate = self;
    rewarded.impressionDelegate = self;
    self.rewardedAds = rewarded;

    CASAppOpen *appOpen = [[CASAppOpen alloc] initWithCasID:casId];
    appOpen.delegate = self;
    appOpen.impressionDelegate = self;
    self.appOpenAds = appOpen;

    CASManagerBuilder *builder = [CAS buildManager];

    [builder withTestAdMode:[options[@"forceTestAds"] boolValue]];

    NSNumber *showConsent = options[@"showConsentFormIfRequired"];

    if (showConsent != nil && [showConsent boolValue]) {
        CASConsentFlow *consentFlow = [[CASConsentFlow alloc] initWithEnabled:YES];

        // Privacy geography
        NSNumber *privacyGeo = options[@"debugPrivacyGeography"];

        if (privacyGeo != nil) {
            consentFlow.debugGeography = (CASUserDebugGeography)[privacyGeo integerValue];
        }

        [builder withConsentFlow:consentFlow];
    }

    [builder withFramework:@"ReactNative" version:options[@"reactNativeVersion"]];

    // Completion handler
    [builder withCompletionHandler:^(CASInitialConfig *_Nonnull config) {
        self.casInitConfig = [NSMutableDictionary dictionary];

        if (config.error) {
            self.casInitConfig[@"error"] = config.error;
        }

        if (config.countryCode) {
            self.casInitConfig[@"countryCode"] = config.countryCode;
        }

        self.casInitConfig[@"isConsentRequired"] = @(config.isConsentRequired);
        self.casInitConfig[@"consentFlowStatus"] = @(config.consentFlowStatus);

        resolve(self.casInitConfig);
    }];

    [builder createWithCasId:casId];
}

RCT_EXPORT_METHOD(isInitialized:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    BOOL initialized = (self.casInitConfig != nil);

    resolve(@(initialized));
}


#pragma mark - Event Emmiter

- (void)startObserving {
    self.hasListeners = YES;
}

- (void)stopObserving {
    self.hasListeners = NO;
}

#pragma mark - SDK Version

RCT_EXPORT_METHOD(getSDKVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    resolve([CAS getSDKVersion]);
}


#pragma mark - Consent Flow

RCT_EXPORT_METHOD(showConsentFlow:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject) {
    CASConsentFlow *flow = [[CASConsentFlow alloc] init];

    flow.completionHandler = ^(enum CASConsentFlowStatus status) {
        NSNumber *statusNumber = @(status);
        resolve(statusNumber);
    };
    [flow present];
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
    if (!self.interstitialAds) {
        resolve(@(NO));
        return;
    }

    resolve(@([self.interstitialAds isAdLoaded]));
}

RCT_EXPORT_METHOD(loadInterstitialAd) {
    if (!self.interstitialAds) {
        [self sendAdEvent:kOnInterstitialLoadFailed withError:CASError.notInitialized];
        return;
    }

    [self.interstitialAds loadAd];
}

RCT_EXPORT_METHOD(showInterstitialAd) {
    if (!self.interstitialAds) {
        [self sendAdEvent:kOnInterstitialFailedToShow withError:CASError.notInitialized];
        return;
    }

    [self.interstitialAds presentFromViewController:nil];
}

RCT_EXPORT_METHOD(setInterstitialMinInterval:(long)seconds) {
    if (self.interstitialAds) {
        self.interstitialAds.minInterval = seconds;
    }
}

RCT_EXPORT_METHOD(restartInterstitialInterval) {
    if (self.interstitialAds) {
        [self.interstitialAds restartInterval];
    }
}

RCT_EXPORT_METHOD(setInterstitialAutoloadEnabled:(BOOL)enabled) {
    if (self.interstitialAds) {
        self.interstitialAds.isAutoloadEnabled = enabled;
    }
}

RCT_EXPORT_METHOD(setInterstitialAutoshowEnabled:(BOOL)enabled) {
    if (self.interstitialAds) {
        self.interstitialAds.isAutoshowEnabled = enabled;
    }
}

RCT_EXPORT_METHOD(destroyInterstitial) {
    if (self.interstitialAds) {
        [self.interstitialAds destroy];
        self.interstitialAds = [[CASInterstitial alloc] initWithCasID:self.casIdendifier];
        self.interstitialAds.delegate = self;
        self.interstitialAds.impressionDelegate = self;
    }
}


#pragma mark - AppOpen

RCT_EXPORT_METHOD(isAppOpenAdLoaded:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if (!self.appOpenAds) {
        resolve(@(NO));
        return;
    }

    resolve(@([self.appOpenAds isAdLoaded]));
}

RCT_EXPORT_METHOD(loadAppOpenAd) {
    if (!self.appOpenAds) {
        [self sendAdEvent:kOnAppOpenLoadFailed withError:CASError.notInitialized];
        return;
    }

    [self.appOpenAds loadAd];
}

RCT_EXPORT_METHOD(showAppOpenAd) {
    if (!self.appOpenAds) {
        [self sendAdEvent:kOnAppOpenFailedToShow withError:CASError.notInitialized];
        return;
    }

    [self.appOpenAds presentFromViewController:nil];
}

RCT_EXPORT_METHOD(setAppOpenAutoloadEnabled:(BOOL)enabled) {
    if (self.appOpenAds) {
        self.appOpenAds.isAutoloadEnabled = enabled;
    }
}

RCT_EXPORT_METHOD(setAppOpenAutoshowEnabled:(BOOL)enabled) {
    if (self.appOpenAds) {
        self.appOpenAds.isAutoshowEnabled = enabled;
    }
}

RCT_EXPORT_METHOD(destroyAppOpen) {
    if (self.appOpenAds) {
        [self.appOpenAds destroy];
        self.appOpenAds = [[CASAppOpen alloc] initWithCasID:self.casIdendifier];
        self.appOpenAds.delegate = self;
        self.appOpenAds.impressionDelegate = self;
    }
}


#pragma mark - Rewarded

RCT_EXPORT_METHOD(isRewardedAdLoaded:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if (!self.rewardedAds) {
        resolve(@(NO));
        return;
    }

    resolve(@([self.rewardedAds isAdLoaded]));
}

RCT_EXPORT_METHOD(loadRewardedAd) {
    if (!self.rewardedAds) {
        [self sendAdEvent:kOnRewardedLoadFailed withError:CASError.notInitialized];
        return;
    }

    [self.rewardedAds loadAd];
}

RCT_EXPORT_METHOD(showRewardedAd) {
    if (!self.rewardedAds) {
        [self sendAdEvent:kOnRewardedFailedToShow withError:CASError.notInitialized];
        return;
    }

    [self.rewardedAds presentFromViewController:nil
                       userDidEarnRewardHandler:^(CASContentInfo *_Nonnull info) {
        if (self.hasListeners) {
            [self sendEventWithName:kOnRewardedCompleted
                               body:nil];
        }
    }];
}

RCT_EXPORT_METHOD(setRewardedAutoloadEnabled:(BOOL)enabled) {
    if (self.rewardedAds) {
        self.rewardedAds.isAutoloadEnabled = enabled;
    }
}

RCT_EXPORT_METHOD(destroyRewarded) {
    if (self.rewardedAds) {
        [self.rewardedAds destroy];
        self.rewardedAds = [[CASRewarded alloc] initWithCasID:self.casIdendifier];
        self.rewardedAds.delegate = self;
        self.rewardedAds.impressionDelegate = self;
    }
}

- (void)sendAdEvent:(NSString *)event withError:(CASError *)error {
    if (!self.hasListeners) {
        return;
    }

    [self sendEventWithName:event body:@{ @"code": @(error.code), @"message": error.description }];
}

- (void)sendEvent:(NSString *)event withInfo:(CASContentInfo *_Nonnull)info {
    if (!self.hasListeners) {
        return;
    }

    NSDictionary *impressionData = [CASMobileAds convertImpressionInfo:info];
    [self sendEventWithName:event body:impressionData];
}

#pragma mark - CASScreenContentDelegate

- (void)screenAdDidLoadContent:(id<CASScreenContent>)ad {
    if (!self.hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = kOnRewardedLoaded;
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = kOnInterstitialLoaded;
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = kOnAppOpenLoaded;
    }

    [self sendEventWithName:event body:nil];
}

- (void)screenAd:(id<CASScreenContent>)ad didFailToLoadWithError:(CASError *)error {
    if (!self.hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = kOnRewardedLoadFailed;
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = kOnInterstitialLoadFailed;
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = kOnAppOpenLoadFailed;
    }

    [self sendAdEvent:event withError:error];
}

- (void)screenAdWillPresentContent:(id<CASScreenContent>)ad {
    if (!self.hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = kOnRewardedDisplayed;
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = kOnInterstitialDisplayed;
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = kOnAppOpenDisplayed;
    }

    [self sendEventWithName:event body:nil];
}

- (void)screenAd:(id<CASScreenContent>)ad didFailToPresentWithError:(CASError *)error {
    if (!self.hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = kOnRewardedFailedToShow;
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = kOnInterstitialFailedToShow;
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = kOnAppOpenFailedToShow;
    }

    [self sendAdEvent:event withError:error];
}

- (void)screenAdDidClickContent:(id<CASScreenContent>)ad {
    if (!self.hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = kOnRewardedClicked;
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = kOnInterstitialClicked;
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = kOnAppOpenClicked;
    }

    [self sendEventWithName:event body:nil];
}

- (void)screenAdDidDismissContent:(id<CASScreenContent>)ad {
    if (!self.hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = kOnRewardedHidden;
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = kOnInterstitialHidden;
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = kOnAppOpenHidden;
    }

    [self sendEventWithName:event body:nil];
}

- (void)adDidRecordImpressionWithInfo:(CASContentInfo *_Nonnull)info {
    if (!self.hasListeners) {
        return;
    }

    NSMutableDictionary *impressionData = [NSMutableDictionary dictionary];

    if (info.format) {
        impressionData[@"format"] = info.format.label;
    }

    impressionData[@"sourceName"] = info.sourceName ? : @"";
    impressionData[@"sourceUnitId"] = info.sourceUnitID ? : @"";

    if (info.creativeID) {
        impressionData[@"creativeId"] = info.creativeID;
    }

    impressionData[@"revenue"] = @(info.revenue);
    impressionData[@"revenuePrecision"] = @(info.revenuePrecision);
    impressionData[@"impressionDepth"] = @(info.impressionDepth);
    impressionData[@"revenueTotal"] = @(info.revenueTotal);

    if ([info.format isEqual:[CASFormat interstitial]]) {
        [self sendEventWithName:kOnInterstitialImpression body:impressionData];
    } else if ([info.format isEqual:[CASFormat rewarded]]) {
        [self sendEventWithName:kOnRewardedImpression body:impressionData];
    } else if ([info.format isEqual:[CASFormat appOpen]]) {
        [self sendEventWithName:kOnAppOpenImpression body:impressionData];
    }
}

@end
