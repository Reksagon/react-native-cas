package com.cleveradssolutions.plugin.reactnative.views

import com.cleversolutions.ads.AdSize
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

object AdViewManagerImpl {
  const val NAME = "AdView"

  fun createViewInstance(ctx: ThemedReactContext): CASAdView = CASAdView(ctx)

  fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> = mapOf(
    "onAdViewLoaded" to mapOf("registrationName" to "onAdViewLoaded"),
    "onAdViewFailed" to mapOf("registrationName" to "onAdViewFailed"),
    "onAdViewClicked" to mapOf("registrationName" to "onAdViewClicked"),
    "onAdViewImpression" to mapOf("registrationName" to "onAdViewImpression"),
    "isAdLoaded" to mapOf("registrationName" to "isAdLoaded"),
  )

  fun setSize(view: CASAdView, value: String?) {
    view.size = when (value) {
      "B" -> AdSize.BANNER
      "M" -> AdSize.MEDIUM_RECTANGLE
      "L" -> AdSize.LEADERBOARD
      "S" -> AdSize.getSmartBanner(view.context)
      "A" -> AdSize.getAdaptiveBannerInScreen(view.context)
      else -> AdSize.BANNER
    }
  }

  fun setIsAutoloadEnabled(view: CASAdView, enabled: Boolean) {
    view.banner.isAutoloadEnabled = enabled
  }

  fun setLoadOnMount(view: CASAdView, value: Boolean) {
    view.loadOnMount = value
  }

  fun setRefreshInterval(view: CASAdView, value: Int) {
    view.setRefreshInterval(value)
  }

  fun onAfterUpdateTransaction(view: CASAdView) {
    view.applyProps()
  }

  fun onDropViewInstance(view: CASAdView) {
    view.destroyView()
  }

  fun commandLoadAd(view: CASAdView) {
    view.load()
  }

  fun commandDestroy(view: CASAdView) {
    view.destroyView()
  }

  fun setCasId(view: CASAdView, value: String?) {
    view.casId = value
  }

}
