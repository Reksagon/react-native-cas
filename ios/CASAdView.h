#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@class CASBannerView;
@class CASSize;
@class CASContentInfo;

NS_ASSUME_NONNULL_BEGIN

@interface CASAdView : UIView

// MARK: - Designated Initializers
- (instancetype)initWithCasID:(NSString *)casID
                         size:(CASSize *)size
                       origin:(CGPoint)origin NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithFrame:(CGRect)frame NS_DESIGNATED_INITIALIZER;
- (nullable instancetype)initWithCoder:(NSCoder *)coder NS_DESIGNATED_INITIALIZER;

// MARK: - Configurable Properties
@property (nonatomic, copy, nullable) NSString *casID;              // JS: casId
@property (nonatomic, strong, nullable) CASSize *adSize;            // JS: adSize
@property (nonatomic, copy) NSString *size;                         // JS: size
@property (nonatomic) BOOL isAutoloadEnabled;                       // JS: isAutoloadEnabled
@property (nonatomic) BOOL loadOnMount;                             // JS: loadOnMount
@property (nonatomic) NSInteger refreshInterval;                    // JS: refreshInterval

// MARK: - React Event Callbacks
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onAdViewLoaded;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onAdViewFailed;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onAdViewClicked;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onAdViewImpression;

// MARK: - Readonly Info
@property (nonatomic, readonly, strong, nullable) CASBannerView *bannerView;
@property (nonatomic, readonly, getter=isAdLoaded) BOOL adLoaded;
@property (nonatomic, readonly, strong, nullable) CASContentInfo *contentInfo;

// MARK: - Public Methods
- (void)loadAd;
- (void)destroy;

@end

NS_ASSUME_NONNULL_END
