#import <React/RCTViewManager.h>
#import "CASAdView.h"

@interface CASAdViewManager : RCTViewManager
@end

@implementation CASAdViewManager

RCT_EXPORT_MODULE(AdView)

- (UIView *)view {
  return [[CASAdView alloc] init];
}

// Props
RCT_EXPORT_VIEW_PROPERTY(adUnitId, NSString)
RCT_EXPORT_VIEW_PROPERTY(adFormat, NSString)
RCT_EXPORT_VIEW_PROPERTY(adViewSize, NSString)

@end
