#import "CASMobileAds.h"

@interface CASMobileAds() <CASEventDelegate>
@property(nonatomic, strong) CASMediationManager *manager;
@property(nonatomic, strong) CASAppOpenAd *appOpen;
@property(nonatomic, strong) CASInterstitialAd *interstitial;
@property(nonatomic, strong) CASRewardedAd *rewarded;
@end

@implementation CASMobileAds
{
  bool hasListeners;
}

RCT_EXPORT_MODULE();


#pragma mark - React Native lifecycle

- (NSArray<NSString *> *)supportedEvents {
  return @[
    // AppOpen
    @"onAppOpenLoaded", 
    @"onAppOpenLoadFailed", 
    @"onAppOpenDisplayed",
    @"onAppOpenFailedToShow", 
    @"onAppOpenHidden", 
    @"onAppOpenClicked", 
    @"onAppOpenImpression",
    // Interstitial
    @"onInterstitialLoaded", 
    @"onInterstitialLoadFailed", 
    @"onInterstitialClicked",
    @"onInterstitialDisplayed", 
    @"onInterstitialFailedToShow", 
    @"onInterstitialHidden", 
    @"onInterstitialImpression",
    // Rewarded
    @"onRewardedLoaded", 
    @"onRewardedLoadFailed", 
    @"onRewardedClicked",
    @"onRewardedDisplayed", 
    @"onRewardedFailedToShow",
    @"onRewardedHidden",
    @"onRewardedCompleted", 
    @"onRewardedImpression"
  ];
}

- (void)startObserving { hasListeners = true; }
- (void)stopObserving { hasListeners = false; }

#pragma mark - API methods

RCT_EXPORT_METHOD(initialize:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSString *casId = params[@"casId"];
    if (!casId) { reject(@"no_casId", @"CAS ID is required", nil); return; }

    self.manager = [CAS buildManager:casId];
    self.manager.eventDelegate = self;

    self.appOpen = [self.manager appOpen];
    self.appOpen.delegate = self;

    self.interstitial = [self.manager interstitial];
    self.interstitial.delegate = self;

    self.rewarded = [self.manager rewarded];
    self.rewarded.delegate = self;

    resolve(@{ @"success": @YES });
  }
  @catch (NSException *exception) {
    reject(@"init_error", exception.reason, nil);
  }
}

RCT_EXPORT_METHOD(isInterstitialAdLoaded:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@(self.interstitial.isReady));
}

RCT_EXPORT_METHOD(loadInterstitialAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.interstitial loadWithCompletion:^(BOOL ready, NSError * _Nullable error) {
    if (ready) {
      if (self->hasListeners) [self sendEventWithName:@"onInterstitialLoaded" body:nil];
      resolve(@YES);
    } else {
      if (self->hasListeners) [self sendEventWithName:@"onInterstitialLoadFailed" body:@{@"error": error.localizedDescription ?: @"Unknown"}];
      reject(@"load_failed", @"Interstitial failed to load", error);
    }
  }];
}

RCT_EXPORT_METHOD(showInterstitialAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (self.interstitial.isReady) {
    UIViewController *root = UIApplication.sharedApplication.delegate.window.rootViewController;
    [self.interstitial presentFromRootViewController:root];
    resolve(@YES);
  } else { reject(@"not_ready", @"Interstitial not loaded", nil); }
}

#pragma mark - Rewarded Ads

RCT_EXPORT_METHOD(isRewardedAdLoaded:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@(self.rewarded.isReady));
}

RCT_EXPORT_METHOD(loadRewardedAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.rewarded loadWithCompletion:^(BOOL ready, NSError * _Nullable error) {
    if (ready) {
      if (self->hasListeners) [self sendEventWithName:@"onRewardedLoaded" body:nil];
      resolve(@YES);
    } else {
      if (self->hasListeners) [self sendEventWithName:@"onRewardedLoadFailed" body:@{@"error": error.localizedDescription ?: @"Unknown"}];
      reject(@"load_failed", @"Rewarded failed to load", error);
    }
  }];
}

RCT_EXPORT_METHOD(showRewardedAd:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (self.rewarded.isReady) {
    UIViewController *root = UIApplication.sharedApplication.delegate.window.rootViewController;
    [self.rewarded presentFromRootViewController:root];
    resolve(@YES);
  } else { reject(@"not_ready", @"Rewarded not loaded", nil); }
}

#pragma mark - CASEventDelegate

- (void)willShownAd:(id<CASStatusHandler>)ad {
  if (!hasListeners) return;

  if ([ad isKindOfClass:[CASInterstitialAd class]]) {
    [self sendEventWithName:@"onInterstitialDisplayed" body:nil];
  } else if ([ad isKindOfClass:[CASRewardedAd class]]) {
    [self sendEventWithName:@"onRewardedDisplayed" body:nil];
  } else if ([ad isKindOfClass:[CASAppOpenAd class]]) {
    [self sendEventWithName:@"onAppOpenDisplayed" body:nil];
  }
}

- (void)didClickedAd:(id<CASStatusHandler>)ad {
  if (!hasListeners) return;

  if ([ad isKindOfClass:[CASInterstitialAd class]]) [self sendEventWithName:@"onInterstitialClicked" body:nil];
  if ([ad isKindOfClass:[CASRewardedAd class]]) [self sendEventWithName:@"onRewardedClicked" body:nil];
  if ([ad isKindOfClass:[CASAppOpenAd class]]) [self sendEventWithName:@"onAppOpenClicked" body:nil];
}

- (void)didCompletedAd:(id<CASStatusHandler>)ad {
  if (!hasListeners) return;

  if ([ad isKindOfClass:[CASInterstitialAd class]]) [self sendEventWithName:@"onInterstitialHidden" body:nil];
  if ([ad isKindOfClass:[CASRewardedAd class]]) {
    [self sendEventWithName:@"onRewardedHidden" body:nil];
    [self sendEventWithName:@"onRewardedCompleted" body:nil];
  }
  if ([ad isKindOfClass:[CASAppOpenAd class]]) [self sendEventWithName:@"onAppOpenHidden" body:nil];
}

- (void)didFailedAd:(id<CASStatusHandler>)ad withError:(NSString *)error {
  if (!hasListeners) return;

  if ([ad isKindOfClass:[CASInterstitialAd class]]) [self sendEventWithName:@"onInterstitialFailedToShow" body:@{@"error": error}];
  if ([ad isKindOfClass:[CASRewardedAd class]]) [self sendEventWithName:@"onRewardedFailedToShow" body:@{@"error": error}];
  if ([ad isKindOfClass:[CASAppOpenAd class]]) [self sendEventWithName:@"onAppOpenFailedToShow" body:@{@"error": error}];
}

- (void)didImpressionAd:(id<CASStatusHandler>)ad {
  if (!hasListeners) return;

  if ([ad isKindOfClass:[CASInterstitialAd class]]) [self sendEventWithName:@"onInterstitialImpression" body:nil];
  if ([ad isKindOfClass:[CASRewardedAd class]]) [self sendEventWithName:@"onRewardedImpression" body:nil];
  if ([ad isKindOfClass:[CASAppOpenAd class]]) [self sendEventWithName:@"onAppOpenImpression" body:nil];
}

@end
