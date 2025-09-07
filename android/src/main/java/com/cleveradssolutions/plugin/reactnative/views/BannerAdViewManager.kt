package com.cleveradssolutions.plugin.reactnative.views

import android.view.ViewGroup
import com.cleveradssolutions.plugin.reactnative.extensions.getIntOrZero
import com.cleveradssolutions.plugin.reactnative.extensions.getStringOrEmpty
import com.cleveradssolutions.plugin.reactnative.extensions.toReadableMap
import com.cleversolutions.ads.AdError
import com.cleversolutions.ads.AdImpression
import com.cleversolutions.ads.android.CASBannerView
import com.cleversolutions.ads.AdSize
import com.facebook.infer.annotation.Assertions
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableType

class BannerAdViewManager : SimpleViewManager<CASBannerView>(), com.cleversolutions.ads.AdViewListener {

  override fun getName() = "AdView"

  override fun createViewInstance(reactContext: ThemedReactContext): CASBannerView {
    val view = CASBannerView(reactContext)
    view.layoutParams = ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.WRAP_CONTENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    )
    view.adListener = this
    return view
  }

  @ReactProp(name = "isAutoloadEnabled")
  fun setAutoloadEnabled(view: CASBannerView, enabled: Boolean) {
    view.isAutoloadEnabled = enabled
  }

  @ReactProp(name = "refreshInterval")
  fun setRefreshInterval(view: CASBannerView, interval: Int) {
    if (interval == 0) view.disableAdRefresh() else view.refreshInterval = interval
  }

  @ReactProp(name = "size")
  fun setSize(view: CASBannerView, sizeDyn: Dynamic) {
    var size = AdSize.BANNER
    when (sizeDyn.type) {
      ReadableType.Map -> {
        val sizeMap = sizeDyn.asMap()
        size = if (sizeMap.hasKey("isAdaptive")) {
          val maxWidthDpi = sizeMap.getIntOrZero("maxWidthDpi")
          if (maxWidthDpi == 0) AdSize.getAdaptiveBannerInScreen(view.context)
          else AdSize.getAdaptiveBanner(view.context, maxWidthDpi)
        } else {
          when (sizeMap.getStringOrEmpty("size")) {
            "LEADERBOARD" -> AdSize.LEADERBOARD
            "MEDIUM_RECTANGLE" -> AdSize.MEDIUM_RECTANGLE
            "SMART" -> AdSize.getSmartBanner(view.context)
            else -> AdSize.BANNER
          }
        }
      }
      ReadableType.String, ReadableType.Number -> {
        val v = if (sizeDyn.type == ReadableType.Number) sizeDyn.asDouble().toInt().toString() else sizeDyn.asString()
        size = when (v) {
          "B","BANNER","320x50" -> AdSize.BANNER
          "M","MEDIUM_RECTANGLE","300x250" -> AdSize.MEDIUM_RECTANGLE
          "L","LEADERBOARD","728x90" -> AdSize.LEADERBOARD
          "S","SMART" -> AdSize.getSmartBanner(view.context)
          "A","ADAPTIVE" -> AdSize.getAdaptiveBannerInScreen(view.context)
          else -> AdSize.BANNER
        }
      }
      else -> size = AdSize.BANNER
    }
    view.size = size
  }

  override fun onDropViewInstance(view: CASBannerView) {
    super.onDropViewInstance(view)
    view.destroy()
  }

  override fun onAdViewPresented(view: CASBannerView, info: AdImpression) {
    val map = WritableNativeMap().apply { putMap("impression", info.toReadableMap()) }
    (view.context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(view.id, "onAdViewImpression", map)
  }

  override fun onAdViewClicked(view: CASBannerView) {
    val map = WritableNativeMap()
    (view.context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(view.id, "onAdViewClicked", map)
  }

  override fun onAdViewFailed(view: CASBannerView, error: AdError) {
    val map = WritableNativeMap().apply {
      putMap("error", WritableNativeMap().apply {
        putInt("code", error.code)
        putString("message", error.message)
      })
    }
    (view.context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(view.id, "onAdViewFailed", map)
  }

  override fun onAdViewLoaded(view: CASBannerView) {
    val map = WritableNativeMap().apply {
      putInt("width", view.width)
      putInt("height", view.height)
    }
    (view.context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(view.id, "onAdViewLoaded", map)
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> = mapOf(
    "onAdViewLoaded" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "onAdViewLoaded")),
    "onAdViewFailed" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "onAdViewFailed")),
    "onAdViewClicked" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "onAdViewClicked")),
    "onAdViewImpression" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "onAdViewImpression")),
    "isAdReady" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "isAdReady")),
  )

  override fun getCommandsMap(): MutableMap<String, Int> = mutableMapOf(
    "isAdLoaded" to 0,
    "loadAd" to 1,
    "startAutoRefresh" to 2,
    "stopAutoRefresh" to 3
  )

  override fun receiveCommand(root: CASBannerView, commandId: String?, args: ReadableArray?) {
    when (commandId) {
      "isAdLoaded" -> {
        val map = WritableNativeMap().apply { putBoolean("isAdLoaded", root.isLoaded) }
        (root.context as ThemedReactContext)
          .getJSModule(RCTEventEmitter::class.java)
          .receiveEvent(root.id, "isAdLoaded", map)
      }
      "loadAd" -> root.load()
      "startAutoRefresh" -> if (root.refreshInterval == 0) root.refreshInterval = 30
      "stopAutoRefresh" -> root.disableAdRefresh()
    }
  }
}
