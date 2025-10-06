package com.cleveradssolutions.plugin.reactnative.views

import com.cleversolutions.ads.AdSize
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter

class BannerAdViewManager : SimpleViewManager<CASAdView>() {

  override fun getName() = "AdView"

  override fun createViewInstance(reactContext: ThemedReactContext): CASAdView {
    return CASAdView(reactContext)
  }

  @ReactProp(name = "isAutoloadEnabled")
  fun setAutoloadEnabled(view: CASAdView, enabled: Boolean) {
    view.banner.isAutoloadEnabled = enabled
  }

  @ReactProp(name = "autoRefresh", defaultBoolean = true)
  fun setAutoRefresh(view: CASAdView, enabled: Boolean) {
    view.autoRefresh = enabled
  }

  @ReactProp(name = "loadOnMount", defaultBoolean = true)
  fun setLoadOnMount(view: CASAdView, enabled: Boolean) {
    view.loadOnMount = enabled
  }

  @ReactProp(name = "refreshInterval")
  fun setRefreshInterval(view: CASAdView, interval: Int) {
    view.setRefreshInterval(interval)
  }

  @ReactProp(name = "size")
  fun setSize(view: CASAdView, sizeDyn: Dynamic) {
    var size = AdSize.BANNER
    when (sizeDyn.type) {
      ReadableType.String, ReadableType.Number -> {
        val v = if (sizeDyn.type == ReadableType.Number)
          sizeDyn.asDouble().toInt().toString()
        else sizeDyn.asString()
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

  override fun onAfterUpdateTransaction(view: CASAdView) {
    super.onAfterUpdateTransaction(view)
    view.applyProps()
  }

  override fun onDropViewInstance(view: CASAdView) {
    super.onDropViewInstance(view)
    view.destroyView()
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> = mapOf(
    "onAdViewLoaded" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "onAdViewLoaded")),
    "onAdViewFailed" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "onAdViewFailed")),
    "onAdViewClicked" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "onAdViewClicked")),
    "onAdViewImpression" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "onAdViewImpression")),
    "isAdLoaded" to mapOf("phasedRegistrationNames" to mapOf("bubbled" to "isAdLoaded")),
  )

  override fun getCommandsMap(): MutableMap<String, Int> = mutableMapOf(
    "isAdLoaded" to 0,
    "loadAd" to 1,
    "setRefreshInterval" to 2,
    "destroy" to 3,
  )

  override fun receiveCommand(root: CASAdView, commandId: String?, args: ReadableArray?) {
    when (commandId) {
      "isAdLoaded" -> {
        val map = WritableNativeMap().apply { putBoolean("isAdLoaded", root.isLoaded()) }
        (root.context as ThemedReactContext)
          .getJSModule(RCTEventEmitter::class.java)
          .receiveEvent(root.id, "isAdLoaded", map)
      }
      "loadAd" -> root.load()
      "setRefreshInterval" -> {
        val interval = args?.getInt(0) ?: 0
        root.setRefreshInterval(interval)
      }
      "destroy" -> root.destroyView()
    }
  }
}
