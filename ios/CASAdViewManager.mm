#import "CASAdViewManager.h"
#import "CASAdView.h"
#import <React/RCTUIManager.h>

@implementation CASAdViewManager

RCT_EXPORT_MODULE(CASAdView)

- (UIView *)view {
  // Create CASAdView with default empty values; RN will set props via exported properties.
  // Important: do not call designated initWithCasID here unless casID known — use initWithFrame:
  CASAdView *view = [[CASAdView alloc] initWithFrame:CGRectZero];
  return view;
}

// Export props
RCT_EXPORT_VIEW_PROPERTY(casID, NSString)
RCT_EXPORT_VIEW_PROPERTY(size, NSString)         // custom converter to CASSize
RCT_EXPORT_VIEW_PROPERTY(isAutoloadEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(loadOnMount, BOOL)
RCT_EXPORT_VIEW_PROPERTY(refreshInterval, NSInteger)

// Events
RCT_EXPORT_VIEW_PROPERTY(onAdViewLoaded, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdViewFailed, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdViewClicked, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdViewImpression, RCTBubblingEventBlock)

// Commands
RCT_EXPORT_METHOD(loadAd:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    UIView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[CASAdView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting CASAdView, got: %@", view);
      return;
    }
    [(CASAdView *)view loadAd];
  }];
}

RCT_EXPORT_METHOD(destroy:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    UIView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[CASAdView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting CASAdView, got: %@", view);
      return;
    }
    [(CASAdView *)view destroy];
  }];
}

@end
