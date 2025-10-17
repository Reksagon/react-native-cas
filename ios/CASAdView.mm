#import "CASAdView.h"

#import <CleverAdsSolutions/CASTypeFlags.h>
#import <CleverAdsSolutions/CASInternalUtils.h>
#import <CleverAdsSolutions/CleverAdsSolutions.h>
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>

@interface CASAdView () <CASBannerDelegate, CASImpressionDelegate>
@property (nonatomic, strong) CASBannerView *bannerView;
@end

@implementation CASAdView

#pragma mark - Initialization

- (instancetype)initWithCasID:(NSString *)casID size:(CASSize *)size origin:(CGPoint)origin {
  if (self = [super initWithFrame:CGRectZero]) {
    _casID = [casID copy];
    _adSize = size;
    _isAutoloadEnabled = YES;
    _loadOnMount = NO;
    _refreshInterval = 0;
    
    _bannerView = [[CASBannerView alloc] initWithCasID:casID size:size origin:origin];
    _bannerView.delegate = self;
    _bannerView.impressionDelegate = self;
    _bannerView.translatesAutoresizingMaskIntoConstraints = NO;
    _bannerView.isAutoloadEnabled = _isAutoloadEnabled;
    _bannerView.refreshInterval = _refreshInterval;
    
    [self addSubview:_bannerView];
    [self setupConstraintsForBanner:_bannerView size:size];
  }
  return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    // Creating empty banner (init with JS)
    _isAutoloadEnabled = YES;
    _loadOnMount = NO;
    _refreshInterval = 0;
  }
  return self;
}

- (nullable instancetype)initWithCoder:(NSCoder *)coder {
  if (self = [super initWithCoder:coder]) {
    _isAutoloadEnabled = YES;
    _loadOnMount = NO;
    _refreshInterval = 0;
  }
  return self;
}


#pragma mark - Setup

- (void)setupConstraintsForBanner:(CASBannerView *)banner size:(CASSize *)size {
  [NSLayoutConstraint activateConstraints:@[
    [banner.centerXAnchor constraintEqualToAnchor:self.centerXAnchor],
    [banner.centerYAnchor constraintEqualToAnchor:self.centerYAnchor],
    [banner.widthAnchor constraintEqualToConstant:size.width],
    [banner.heightAnchor constraintEqualToConstant:size.height]
  ]];
}

#pragma mark - Public Methods

- (void)loadAd {
  if (!_bannerView) {
    if (_adSize) {
      _bannerView = [[CASBannerView alloc] initWithCasID:_casID size:_adSize origin:CGPointZero];
      _bannerView.delegate = self;
      _bannerView.impressionDelegate = self;
      _bannerView.isAutoloadEnabled = _isAutoloadEnabled;
      _bannerView.refreshInterval = _refreshInterval;
      _bannerView.translatesAutoresizingMaskIntoConstraints = NO;
      [self addSubview:_bannerView];
      [self setupConstraintsForBanner:_bannerView size:_adSize];
    } else {
      NSLog(@"[CASAdView] Missing casID or adSize before loadAd call.");
      return;
    }
  }
  
  [_bannerView loadAd];
}

- (void)destroy {
  if (_bannerView) {
    [_bannerView destroy];
    _bannerView.delegate = nil;
    _bannerView.impressionDelegate = nil;
    [_bannerView removeFromSuperview];
    _bannerView = nil;
  }
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
    self.onAdViewLoaded(@{ @"casId": self.casID ?: @"" });
  }
}

- (void)bannerAdView:(CASBannerView *)adView didFailWith:(CASError *)error {
  if (self.onAdViewFailed) {
    self.onAdViewFailed(@{ @"error": error.description ?: @"Unknown error" });
  }
}

- (void)bannerAdViewDidRecordClick:(CASBannerView *)adView {
  if (self.onAdViewClicked) {
    self.onAdViewClicked(nil);
  }
}

#pragma mark - CASImpressionDelegate

- (void)bannerAdView:(CASBannerView *)adView willPresent:(id<CASStatusHandler>)impression {
  if (self.onAdViewImpression) {
    self.onAdViewImpression(@{ @"casId": self.casID ?: @"" });
  }
}

- (void)adDidRecordImpressionWithInfo:(CASContentInfo * _Nonnull)info {
  if (!self.onAdViewImpression) return;
  
  NSMutableDictionary *impressionData = [NSMutableDictionary dictionary];
  if (info.format) {
    impressionData[@"format"] = @{
      @"value": @(info.format.value),
      @"label": info.format.label ?: @"",
      @"field": info.format.field ?: @""
    };
  }
  
  impressionData[@"sourceName"] = info.sourceName ?: @"";
  impressionData[@"sourceID"] = @(info.sourceID);
  impressionData[@"sourceUnitID"] = info.sourceUnitID ?: @"";
  impressionData[@"creativeID"] = info.creativeID ?: @"";
  impressionData[@"revenue"] = @(info.revenue);
  impressionData[@"revenuePrecision"] = @(info.revenuePrecision);
  impressionData[@"impressionDepth"] = @(info.impressionDepth);
  impressionData[@"revenueTotal"] = @(info.revenueTotal);
  
  self.onAdViewImpression(@{ @"impression": impressionData });
}

#pragma mark - Additionals Functions

- (void)setSize:(NSString *)sizeName {
    _adSize = [self casSizeFromString:sizeName];
}

- (CASSize *)casSizeFromString:(NSString *)sizeName {
    if (!sizeName) return nil;

    if ([sizeName isEqualToString:@"B"]) {
        return [CASSize banner];
    } else if ([sizeName isEqualToString:@"L"]) {
        return [CASSize leaderboard];
    } else if ([sizeName isEqualToString:@"M"]) {
        return [CASSize mediumRectangle];
    } else if ([sizeName isEqualToString:@"S"]) {
        return [CASSize getSmartBanner];
    } else if ([sizeName isEqualToString:@"A"]) {
        return [CASSize getAdaptiveBannerInContainer:self];
    }
    
    return nil;
}

@end
