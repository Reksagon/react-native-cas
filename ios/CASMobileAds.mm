#import "CASMobileAds.h"


#import <CleverAdsSolutions/CASInternalUtils.h>
#import <CleverAdsSolutions/CASTypeFlags.h>
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>
#import <CleverAdsSolutions/CleverAdsSolutions.h>

@interface CASMobileAds () <CASScreenContentDelegate, CASImpressionDelegate>
@property (nonatomic, strong, nullable) CASInterstitial *interstitial;
@property (nonatomic, strong, nullable) CASRewarded *rewarded;
@property (nonatomic, strong, nullable) CASAppOpen *appOpen;
@property (nonatomic, strong) NSMutableDictionary<NSString *, NSString *> *mediationExtras;
@end

@implementation CASMobileAds {
    // React Native's proposed optimizations to not emit events if no listeners
    BOOL hasListeners;
    NSString *casId;
    BOOL consentFlowEnabled;
    CASMediationManager *manager;
}

RCT_EXPORT_MODULE();

#pragma mark - RCTEventEmitter

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

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

#pragma mark - Init

- (instancetype)init
{
    self = [super init];

    if (self) {
        consentFlowEnabled = YES;
        _mediationExtras = [[NSMutableDictionary alloc] init];
    }

    return self;
}

// TODO remove RCT_EXPORT_METHOD
// add isAutoloadEndable
// add isAutoshowEnabled
// add minimumInterval
// add destroy

RCT_EXPORT_METHOD(initialize:(NSString *)casId
                  testMode:(BOOL)testMode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        CASManagerBuilder *builder = [CAS buildManager];
        [builder withTestAdMode:testMode];

        CASConsentFlow *consentFlow = [[CASConsentFlow alloc] initWithEnabled:consentFlowEnabled];
        consentFlow.completionHandler = ^(enum CASConsentFlowStatus status) {
            [self handleConsentFlowDismissWithStatus:status];
        };
        [builder withConsentFlow:consentFlow];

        [builder withCompletionHandler:^(CASInitialConfig *_Nonnull config) {
#warning ("TODO")
            /*
               error?: string;
               countryCode?: string;
               isConsentRequired: boolean;
               consentFlowStatus: number;
               config.error
               config.countryCode
               config.isConsentRequired
               @(config.consentFlowStatus)
             */
            resolve(@{ @"success": @YES });
        }];

        for (NSString *key in self.mediationExtras) {
            NSString *value = [self.mediationExtras objectForKey:key];
            [builder withMediationExtras:value forKey:key];
        }

        manager = [builder createWithCasId:casId];

        self.interstitial = [[CASInterstitial alloc] initWithCasID:casId];
        self.rewarded = [[CASRewarded alloc] initWithCasID:casId];
        self.appOpen = [[CASAppOpen alloc] initWithCasID:casId];
    } @catch (NSException *e) {
        reject(@"init_error", e.reason, nil);
    }
}

RCT_EXPORT_METHOD(isInitialized:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL initialized = (manager != nil);

    resolve(@(initialized));
}


#pragma mark - Adaptive Banner

RCT_EXPORT_METHOD(getAdaptiveBannerHeightForWidth:(nonnull NSNumber *)width
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
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
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        self.appOpen.delegate = self;
        self.appOpen.impressionDelegate = self;
        [self.appOpen loadAd];
        resolve(@{ @"success": @YES });
    } @catch (NSException *e) {
        reject(@"load_error", e.reason, nil);
    }
}

RCT_EXPORT_METHOD(loadInterstitialAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        self.interstitial.delegate = self;
        self.interstitial.impressionDelegate = self;
        [self.interstitial loadAd];
        resolve(@{ @"success": @YES });
    } @catch (NSException *e) {
        reject(@"load_error", e.reason, nil);
    }
}

RCT_EXPORT_METHOD(loadRewardedAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        self.rewarded.delegate = self;
        self.rewarded.impressionDelegate = self;
        [self.rewarded loadAd];
        resolve(@{ @"success": @YES });
    } @catch (NSException *e) {
        reject(@"load_error", e.reason, nil);
    }
}


#pragma mark - Show Ad Methods

RCT_EXPORT_METHOD(showAppOpenAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (!self.appOpen.isAdLoaded) {
        reject(@"not_loaded", @"AppOpen not loaded", nil);
        return;
    }

    [self.appOpen presentFromViewController:RCTPresentedViewController()];
    resolve(@{ @"success": @YES });
}

RCT_EXPORT_METHOD(showInterstitialAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [self.interstitial presentFromViewController:RCTPresentedViewController()];
    resolve(@{ @"success": @YES });
}


RCT_EXPORT_METHOD(showRewardedAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [self.rewarded presentFromViewController:RCTPresentedViewController()
                    userDidEarnRewardHandler:^(CASContentInfo *_Nonnull info) {
        if (hasListeners) {
            [self sendEventWithName:@"onRewardedCompleted"
                               body:@{}];
        }

        resolve(@{ @"success": @YES });
    }];
}

#pragma mark - Consent

RCT_EXPORT_METHOD(showConsentFlow:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (!consentFlowEnabled) {
        resolve(nil);
        return;
    }

    CASConsentFlow *flow = [[CASConsentFlow alloc] initWithEnabled:YES];
    flow.completionHandler = ^(enum CASConsentFlowStatus status) {
        [self handleConsentFlowDismissWithStatus:status];
    };
    [flow present];
}

RCT_EXPORT_METHOD(setConsentFlowEnabled:(BOOL)enabled) {
    consentFlowEnabled = enabled;
}

#pragma mark - SDK Version / Settings

RCT_EXPORT_METHOD(getSDKVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([CAS getSDKVersion]);
}

- (void)handleConsentFlowDismissWithStatus:(enum CASConsentFlowStatus)status {
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
    if (!hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = @"onRewardedLoadFailed";
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = @"onInterstitialLoadFailed";
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = @"onAppOpenLoadFailed";
    }

    [self sendEventWithName:event body:@{ @"error": error.description }];
}

- (void)adDidPresent:(id<CASScreenContent>)ad {
    if (!hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = @"onRewardedDisplayed";
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = @"onInterstitialDisplayed";
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = @"onAppOpenDisplayed";
    }

    [self sendEventWithName:event body:@{}];
}

- (void)screenAd:(id<CASScreenContent>)ad didFailToPresentWithError:(CASError *)error {
#warning ("TODO")
}

- (void)adDidDismiss:(id<CASScreenContent>)ad {
    if (!hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = @"onRewardedHidden";
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = @"onInterstitialHidden";
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = @"onAppOpenHidden";
    }

    [self sendEventWithName:event body:@{}];
}

- (void)adDidClick:(id<CASScreenContent>)ad {
    if (!hasListeners) {
        return;
    }

    NSString *event = @"";

    if ([ad isKindOfClass:[CASRewarded class]]) {
        event = @"onRewardedClicked";
    } else if ([ad isKindOfClass:[CASInterstitial class]]) {
        event = @"onInterstitialClicked";
    } else if ([ad isKindOfClass:[CASAppOpen class]]) {
        event = @"onAppOpenClicked";
    }

    [self sendEventWithName:event body:@{}];
}

// TODO: template fix
- (void)adDidRecordImpressionWithInfo:(CASContentInfo *_Nonnull)info {
    if (!hasListeners) {
        return;
    }

    NSMutableDictionary *impressionData = [NSMutableDictionary dictionary];

    if (info.format) {
        impressionData[@"format"] = @{
                @"value": @(info.format.value),
                @"label": info.format.label,
                @"field": info.format.field
        };
    }

    impressionData[@"sourceName"] = info.sourceName;
    impressionData[@"sourceID"] = @(info.sourceID);
    impressionData[@"sourceUnitID"] = info.sourceUnitID;

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
    } else if (info.format.isAdView) {
        event = @"onBannerImpression";
    } else if ([info.format isEqual:[CASFormat native]]) {
        event = @"onNativeImpression";
    }

    [self sendEventWithName:event body:impressionData];
}

@end
