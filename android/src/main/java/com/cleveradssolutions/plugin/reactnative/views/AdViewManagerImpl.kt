package com.cleveradssolutions.plugin.reactnative.views

import com.cleveradssolutions.plugin.reactnative.CASMobileAdsModuleImpl
import com.cleversolutions.ads.AdSize
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import kotlin.math.roundToInt

object AdViewManagerImpl {
  const val NAME = "CASAdView"

  fun createViewInstance(ctx: ThemedReactContext): CASAdView = CASAdView(ctx)

  fun getExportedCustomDirectEventTypeConstants(): HashMap<String, Any> =
    hashMapOf(
      "onAdViewLoaded" to mapOf("registrationName" to "onAdViewLoaded"),
      "onAdViewFailed" to mapOf("registrationName" to "onAdViewFailed"),
      "onAdViewClicked" to mapOf("registrationName" to "onAdViewClicked"),
      "onAdViewImpression" to mapOf("registrationName" to "onAdViewImpression"),
    )

  fun setSizeConfig(view: CASAdView, value: ReadableMap?) {
    if (value == null) return
    view.banner.size = when (value.getString("sizeType")) {
      "B" -> AdSize.BANNER
      "M" -> AdSize.MEDIUM_RECTANGLE
      "L" -> AdSize.LEADERBOARD
      "S" -> AdSize.getSmartBanner(view.context)
      "A" -> AdSize.getAdaptiveBanner(
        view.context,
        value.getDouble("maxWidth").roundToInt()
      )

      "I" -> AdSize.getInlineBanner(
        value.getDouble("maxWidth").roundToInt(),
        value.getDouble("maxHeight").roundToInt(),
      )

      else -> AdSize.BANNER
    }
  }

  fun setCasId(view: CASAdView, value: String?) {
    if (!value.isNullOrEmpty()) {
      view.banner.casId = value
    }
  }

  fun setAutoload(view: CASAdView, enabled: Boolean) {
    // Set not to banner for wait all other properties
    view.isAutoloadEnabled = enabled
  }

  fun setRefreshInterval(view: CASAdView, value: Int) {
    view.banner.refreshInterval = value
  }

  fun onAfterUpdateTransaction(view: CASAdView) {
    if (view.banner.casId.isEmpty()) {
      view.banner.casId = CASMobileAdsModuleImpl.casIdentifier
    }
    view.banner.isAutoloadEnabled = view.isAutoloadEnabled
  }

  fun onDropViewInstance(view: CASAdView) {
    view.banner.adListener = null
    view.banner.onImpressionListener = null
    view.banner.destroy()
  }

  fun commandLoadAd(view: CASAdView) {
    view.banner.load()
  }

}
