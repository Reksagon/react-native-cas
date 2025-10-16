#import "CASAdView.h"
#import "CASAdViewUIComponent.h"
#import <CleverAdsSolutions/CleverAdsSolutions-Swift.h>

@interface CASAdViewUIComponent ()

@property (nonatomic, strong) CASAdView *adView;

@end

@implementation CASAdViewUIComponent

#pragma mark - Initialization

- (instancetype)initWithCasID:(NSString *)casID adSize:(CASSize *)adSize {
    if (self = [super init]) {
        _adView = [[CASAdView alloc] initWithFrame:CGRectZero];
        if (casID) {
            _adView.casID = casID;
        }
        if (adSize) {
            _adView.adSize = adSize;
        }
        _adView.isAutoloadEnabled = YES;
        _adView.loadOnMount = NO;
        _adView.refreshInterval = 0;
    }
    return self;
}

#pragma mark - Setters

- (void)setCasID:(NSString *)casID {
    self.adView.casID = casID;
}

- (void)setAdSize:(CASSize *)adSize {
    self.adView.adSize = adSize;
    // Optional: update bannerView layout if already loaded
}

- (void)setIsAutoloadEnabled:(BOOL)isAutoloadEnabled {
    self.adView.isAutoloadEnabled = isAutoloadEnabled;
}

- (void)setRefreshInterval:(NSInteger)interval {
    self.adView.refreshInterval = interval;
}

- (void)setLoadOnMount:(BOOL)loadOnMount {
    self.adView.loadOnMount = loadOnMount;
}

#pragma mark - Public API

- (void)attachToSuperview:(UIView *)superview {
    if (!self.adView.superview && superview) {
        [superview addSubview:self.adView];
        self.adView.translatesAutoresizingMaskIntoConstraints = NO;
        [NSLayoutConstraint activateConstraints:@[
            [self.adView.centerXAnchor constraintEqualToAnchor:superview.centerXAnchor],
            [self.adView.centerYAnchor constraintEqualToAnchor:superview.centerYAnchor]
        ]];
    }
}

- (void)loadAd {
    [self.adView loadAd];
}

- (void)destroy {
    [self.adView destroy];
    [self.adView removeFromSuperview];
}

@end
