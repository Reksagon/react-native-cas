#import "CASAdView.h"
#import "CASMobileAds.h"

#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>
#import <CleverAdsSolutions/CleverAdsSolutions.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import <react/renderer/components/RNCASMobileAdsSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNCASMobileAdsSpec/EventEmitters.h>
#import <react/renderer/components/RNCASMobileAdsSpec/Props.h>
#import <react/renderer/components/RNCASMobileAdsSpec/RCTComponentViewHelpers.h>
#import <React/RCTConversions.h>
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface CASAdView () <RCTCASAdViewViewProtocol, CASBannerDelegate, CASImpressionDelegate>
#else
@interface CASAdView () <CASBannerDelegate, CASImpressionDelegate>
#endif

@end

@implementation CASAdView

#pragma mark - Initialization

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self initAdView];
    }

    return self;
}

- (nullable instancetype)initWithCoder:(NSCoder *)coder {
    if (self = [super initWithCoder:coder]) {
        _loadOnMount = NO;
        [self initAdView];
    }

    return self;
}

- (void)initAdView {
    _bannerView = [[CASBannerView alloc] initWithFrame:self.frame];
    _bannerView.isAutoloadEnabled = NO;
    _bannerView.delegate = self;
    _bannerView.impressionDelegate = self;
    _bannerView.translatesAutoresizingMaskIntoConstraints = NO;
    [self addSubview:_bannerView];
    [self setupConstraintsForBanner:_bannerView];
}

- (NSInteger)refreshInterval {
    return self.bannerView.refreshInterval;
}

- (void)setRefreshInterval:(NSInteger)refreshInterval {
    self.bannerView.refreshInterval = refreshInterval;
}

- (BOOL)isAutoloadEnabled {
    return self.bannerView.isAutoloadEnabled;
}

- (void)setIsAutoloadEnabled:(BOOL)isAutoloadEnabled {
    self.bannerView.isAutoloadEnabled = isAutoloadEnabled;
}

#pragma mark - Setup

- (void)setupConstraintsForBanner:(CASBannerView *)banner {
    [NSLayoutConstraint activateConstraints:@[
         [banner.centerXAnchor constraintEqualToAnchor:self.centerXAnchor],
         [banner.centerYAnchor constraintEqualToAnchor:self.centerYAnchor]
    ]];
}

// Invoked after all the JavaScript properties are set when mounting AdView
- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [self attachAdViewIfNeeded];
}

#pragma mark - Public Methods

- (void)loadAd {
    [_bannerView loadAd];
}

- (void)destroy {
    [_bannerView destroy];
}

#pragma mark - Readonly Getters

- (BOOL)isAdLoaded {
    return _bannerView.isAdLoaded;
}

- (CASContentInfo *)contentInfo {
    return _bannerView.contentInfo;
}

#pragma mark - Layout

- (void)layoutSubviews {
    [super layoutSubviews];
    _bannerView.center = CGPointMake(CGRectGetMidX(self.bounds), CGRectGetMidY(self.bounds));
}

#pragma mark - CASBannerDelegate

- (void)bannerAdViewDidLoad:(CASBannerView *)view {
    if (self.onAdViewLoaded) {
        CGSize size = view.intrinsicContentSize;

        self.onAdViewLoaded(@{ @"width": @(size.width), @"height": @(size.height) });
    }
}

- (void)bannerAdView:(CASBannerView *)adView didFailWith:(CASError *)error {
    if (self.onAdViewFailed) {
        self.onAdViewFailed(@{ @"code": @(error.code), @"message": error.description });
    }
}

- (void)bannerAdViewDidRecordClick:(CASBannerView *)adView {
    if (self.onAdViewClicked) {
        self.onAdViewClicked(nil);
    }
}

#pragma mark - CASImpressionDelegate

- (void)adDidRecordImpressionWithInfo:(CASContentInfo *_Nonnull)info {
    if (self.onAdViewImpression) {
        NSDictionary *impressionData = [CASMobileAds convertImpressionInfo:info];
        self.onAdViewImpression(@{ @"impression": impressionData });
    }
}

#pragma mark - Additionals Functions

- (void)setSize:(NSString *)sizeName {
    self.bannerView.adSize = [self casSizeFromString:sizeName];
}

- (CASSize *)casSizeFromString:(NSString *)sizeName {
    if (!sizeName) {
        return [CASSize banner];
    }

    if ([sizeName isEqualToString:@"B"]) {
        return [CASSize banner];
    } else if ([sizeName isEqualToString:@"L"]) {
        return [CASSize leaderboard];
    } else if ([sizeName isEqualToString:@"M"]) {
        return [CASSize mediumRectangle];
    } else if ([sizeName isEqualToString:@"S"]) {
        return [CASSize getSmartBanner];
    } else if ([sizeName isEqualToString:@"A"]) {
        return [CASSize getAdaptiveBannerInWindow:[UIApplication sharedApplication].delegate.window];
    }

    return [CASSize banner];
}

@end
