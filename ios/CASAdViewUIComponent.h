#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class CASAdView;
@class CASSize;

NS_ASSUME_NONNULL_BEGIN

@interface CASAdViewUIComponent : NSObject

@property (nonatomic, strong, readonly) CASAdView *adView;

/// Init with required values (you may provide casID and adSize)
- (instancetype)initWithCasID:(NSString * _Nullable)casID
                        adSize:(CASSize * _Nullable)adSize;

/// Setters (called by manager when props change)
- (void)setCasID:(NSString *)casID;
- (void)setAdSize:(CASSize *)adSize;
- (void)setIsAutoloadEnabled:(BOOL)isAutoloadEnabled;
- (void)setRefreshInterval:(NSInteger)interval;
- (void)setLoadOnMount:(BOOL)loadOnMount;

/// Public operations
- (void)attachToSuperview:(UIView *)superview; // optional helper
- (void)loadAd;
- (void)destroy;

@end

NS_ASSUME_NONNULL_END
