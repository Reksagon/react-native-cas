package com.cas.views

import android.view.ViewGroup
import com.cas.extensions.MediationManagerWrapper
import com.cas.extensions.getIntOrZero
import com.cas.extensions.getStringOrEmpty
import com.cas.extensions.toReadableMap
import com.cleversolutions.ads.AdError
import com.cleversolutions.ads.AdImpression
import com.cleversolutions.ads.AdSize
import com.cleversolutions.ads.AdViewListener
import com.cleversolutions.ads.android.CASBannerView
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter

@ReactModule(name = "BannerAdView")
class BannerAdViewManager(
  private val managerWrapper: MediationManagerWrapper
) : SimpleViewManager<CASBannerView>(), AdViewListener {

  private val subs = HashMap<CASBannerView, String>()

  override fun getName() = "BannerAdView"

  override fun createViewInstance(reactContext: ThemedReactContext): CASBannerView {
    val view = CASBannerView(reactContext, managerWrapper.manager)

    subs[view] = managerWrapper.addChangeListener { view.manager = it }

    view.layoutParams = ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.WRAP_CONTENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    )

    view.adListener = this
    return view
  }

  @ReactProp(name = "size")
  fun setSize(view: CASBannerView, sizeMap: ReadableMap?) {
    if (sizeMap == null) return
    var size = AdSize.BANNER

    if (sizeMap.hasKey("isAdaptive")) {
      val w = sizeMap.getIntOrZero("maxWidthDpi")
      size = if (w == 0) AdSize.getAdaptiveBannerInScreen(view.context)
             else AdSize.getAdaptiveBanner(view.context, w)
    } else {
      when (sizeMap.getStringOrEmpty("size")) {
        "LEADERBOARD"      -> size = AdSize.LEADERBOARD
        "MEDIUM_RECTANGLE" -> size = AdSize.MEDIUM_RECTANGLE
        "SMART"            -> size = AdSize.getSmartBanner(view.context)
      }
    }
    view.size = size
  }

  @ReactProp(name = "isAutoloadEnabled")
  fun setAutoload(view: CASBannerView, enabled: Boolean?) {
    enabled?.let { view.isAutoloadEnabled = it }
  }

  @ReactProp(name = "refreshInterval")
  fun setRefreshInterval(view: CASBannerView, seconds: Int?) {
    if (seconds == null) return
    if (seconds == 0) view.disableAdRefresh() else view.refreshInterval = seconds
  }

  override fun onDropViewInstance(view: CASBannerView) {
    subs.remove(view)?.let { managerWrapper.removeChangeListener(it) }
    view.destroy()
    super.onDropViewInstance(view)
  }

  // -------- AdViewListener -> JS events (DIRECT) --------

  override fun onAdViewLoaded(view: CASBannerView) {
    val map = WritableNativeMap().apply {
      putInt("width",  view.width)
      putInt("height", view.height)
    }
    emit(view, "onAdViewLoaded", map)
  }

  override fun onAdViewFailed(view: CASBannerView, error: AdError) {
    val map = WritableNativeMap().apply {
      putInt("code", error.code)
      putString("message", error.message)
    }
    emit(view, "onAdViewFailed", map)
  }

  override fun onAdViewClicked(view: CASBannerView) {
    emit(view, "onAdViewClicked", null)
  }

  override fun onAdViewPresented(view: CASBannerView, info: AdImpression) {
    val map = WritableNativeMap().apply {
      putMap("impression", info.toReadableMap())
    }
    emit(view, "onAdViewPresented", map)
  }

  private fun emit(view: CASBannerView, event: String, payload: com.facebook.react.bridge.WritableMap?) {
    (view.context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(view.id, event, payload)
  }

  // -------- RN 0.79: direct events з registrationName --------
  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
    fun reg(name: String) = mapOf("registrationName" to name)
    return mapOf(
      "onAdViewLoaded"     to reg("onAdViewLoaded"),
      "onAdViewFailed"     to reg("onAdViewFailed"),
      "onAdViewClicked"    to reg("onAdViewClicked"),
      "onAdViewPresented"  to reg("onAdViewPresented"),
      "isAdReady"          to reg("isAdReady")
    )
  }

  // -------- Рядкові команди --------
  override fun receiveCommand(root: CASBannerView, commandId: String, args: ReadableArray?) {
    when (commandId) {
      "isAdReady" -> {
        val map = WritableNativeMap().apply { putBoolean("isAdReady", root.isAdReady) }
        emit(root, "isAdReady", map)
      }
      "loadNextAd" -> root.loadNextAd()
    }
  }
}
