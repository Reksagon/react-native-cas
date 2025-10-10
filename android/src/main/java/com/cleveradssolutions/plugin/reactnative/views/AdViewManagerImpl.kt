package com.cleveradssolutions.plugin.reactnative.views

import com.cleversolutions.ads.AdSize
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

object AdViewManagerImpl {
  const val NAME = "CASAdView"

  fun createViewInstance(ctx: ThemedReactContext): CASAdView = CASAdView(ctx)

  fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> = mapOf(
    "onAdViewLoaded" to mapOf("registrationName" to "onAdViewLoaded"),
    "onAdViewFailed" to mapOf("registrationName" to "onAdViewFailed"),
    "onAdViewClicked" to mapOf("registrationName" to "onAdViewClicked"),
    "onAdViewImpression" to mapOf("registrationName" to "onAdViewImpression"),
    "isAdLoaded" to mapOf("registrationName" to "isAdLoaded"),
  )

  fun setSize(view: CASAdView, value: String?) {
    val v = value ?: "B"
    view.size = when (v) {
      "B","BANNER","320x50" -> AdSize.BANNER
      "M","MEDIUM_RECTANGLE","300x250" -> AdSize.MEDIUM_RECTANGLE
      "L","LEADERBOARD","728x90" -> AdSize.LEADERBOARD
      "S","SMART" -> AdSize.getSmartBanner(view.context)
      "A","ADAPTIVE" -> AdSize.getAdaptiveBannerInScreen(view.context)
      else -> AdSize.BANNER
    }
  }

  fun setIsAutoloadEnabled(view: CASAdView, enabled: Boolean) {
    view.banner.isAutoloadEnabled = enabled
  }

  fun setAutoRefresh(view: CASAdView, enabled: Boolean) {
    view.autoRefresh = enabled
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

  fun commandIsAdLoaded(view: CASAdView) {
    val map = WritableNativeMap().apply {
      putBoolean("isAdLoaded", view.isLoaded())
    }
    (view.context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(view.id, "isAdLoaded", map)
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
