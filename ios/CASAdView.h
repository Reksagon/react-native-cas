#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

@class CASBannerView;
@class CASSize;
@class CASContentInfo;


#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
@interface CASAdView : RCTViewComponentView
#else
@interface CASAdView : UIView
#endif

NS_ASSUME_NONNULL_BEGIN

// MARK: - Configurable Properties
@property (nonatomic, copy, nullable) NSString *casID;              // JS: casId
@property (nonatomic, copy) NSString *size;                         // JS: size
@property (nonatomic) BOOL autoloadReload;                          // JS: autoloadReload
@property (nonatomic) BOOL loadOnMount;                             // JS: loadOnMount
@property (nonatomic) NSInteger refreshInterval;                    // JS: refreshInterval

// MARK: - React Event Callbacks
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onAdViewLoaded;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onAdViewFailed;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onAdViewClicked;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onAdViewImpression;

// MARK: - Readonly Info
@property (nonatomic, readonly, strong, nullable) CASBannerView *bannerView;
@property (nonatomic, readonly, getter = isAdLoaded) BOOL adLoaded;
@property (nonatomic, readonly, strong, nullable) CASContentInfo *contentInfo;

// MARK: - Public Methods
- (void)loadAd;
- (void)destroy;

@end

NS_ASSUME_NONNULL_END
