package com.cleveradssolutions.plugin.reactnative

import android.util.Log
import com.cleversolutions.ads.AdSize
import com.cleversolutions.ads.android.CASBannerView
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import kotlin.math.roundToInt

object BannerViewManagerImpl {
  const val NAME = "CASAdView"

  fun createViewInstance(ctx: ThemedReactContext): CASBannerView {
    val view = CASBannerView(ctx)
    val listener = BannerViewListener(ctx)
    view.isAutoloadEnabled = false
    view.casId = CASMobileAdsModuleImpl.casIdentifier
    view.adListener = listener
    view.onImpressionListener = listener
    return view
  }

  fun getExportedCustomDirectEventTypeConstants(): HashMap<String, Any> =
    hashMapOf(
      "onAdViewLoaded" to mapOf("registrationName" to "onAdViewLoaded"),
      "onAdViewFailed" to mapOf("registrationName" to "onAdViewFailed"),
      "onAdViewClicked" to mapOf("registrationName" to "onAdViewClicked"),
      "onAdViewImpression" to mapOf("registrationName" to "onAdViewImpression"),
    )

  fun setSizeConfig(view: CASBannerView, value: ReadableMap?) {
    Log.e(
      "CAS.AI.React", "Banner size config: " +
        "type=${value?.getString("sizeType")}, " +
        "width=${value?.getDouble("maxWidth")?.roundToInt()}, " +
        "height=${value?.getDouble("maxHeight")?.roundToInt()}"
    )

    if (value == null) return
    view.size = when (value.getString("sizeType")) {
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

  fun setCasId(view: CASBannerView, value: String?) {
    if (!value.isNullOrEmpty()) {
      view.casId = value
    }
  }

  fun setAutoload(view: CASBannerView, enabled: Boolean) {
    // Set not to banner for wait all other properties
    val listener = view.adListener as? BannerViewListener ?: return
    listener.isAutoloadEnabled = enabled
  }

  fun setRefreshInterval(view: CASBannerView, value: Int) {
    view.refreshInterval = value
  }

  fun onAfterUpdateTransaction(view: CASBannerView) {
    val listener = view.adListener as BannerViewListener
    listener.viewId = view.id
    if (view.casId.isEmpty()) {
      view.casId = CASMobileAdsModuleImpl.casIdentifier
    }
    view.isAutoloadEnabled = listener.isAutoloadEnabled
  }

  fun onDropViewInstance(view: CASBannerView) {
    view.destroy()
  }

  fun commandLoadAd(view: CASBannerView) {
    view.load()
  }
}
