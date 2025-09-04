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
import com.facebook.infer.annotation.Assertions
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableType

class BannerAdViewManager(private val managerWrapper: MediationManagerWrapper): SimpleViewManager<CASBannerView>(), AdViewListener {
  private val updateSubs = HashMap<CASBannerView, String>()

  override fun getName() = "AdView"

  override fun createViewInstance(reactContext: ThemedReactContext): CASBannerView {
    val view = CASBannerView(reactContext, managerWrapper.manager)

    updateSubs[view] = managerWrapper.addChangeListener { view.manager = it }

    view.layoutParams = ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.WRAP_CONTENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    )

    view.adListener = this

    return view
  }

  @Suppress("unused")
  @ReactProp(name="isAutoloadEnabled")
  fun setAutoloadEnabled(view: CASBannerView, enabled: Boolean) {
    view.isAutoloadEnabled = enabled
  }

  @Suppress("unused")
  @ReactProp(name="refreshInterval")
  fun setRefreshInterval(view: CASBannerView, interval: Int) {
    if (interval == 0) {
      view.disableAdRefresh()
    } else {
      view.refreshInterval = interval
    }
  }

  @ReactProp(name = "size")
  fun setSize(view: CASBannerView, sizeDyn: Dynamic) {
  var size = AdSize.BANNER

  when (sizeDyn.type) {
    ReadableType.Map -> {
      val sizeMap = sizeDyn.asMap()
      if (sizeMap.hasKey("isAdaptive")) {
        val maxWidthDpi = sizeMap.getIntOrZero("maxWidthDpi")
        size = if (maxWidthDpi == 0) {
          AdSize.getAdaptiveBannerInScreen(view.context)
        } else {
          AdSize.getAdaptiveBanner(view.context, maxWidthDpi)
        }
      } else {
        when (sizeMap.getStringOrEmpty("size")) {
          "LEADERBOARD" -> size = AdSize.LEADERBOARD
          "MEDIUM_RECTANGLE" -> size = AdSize.MEDIUM_RECTANGLE
          "SMART" -> size = AdSize.getSmartBanner(view.context)
          else -> size = AdSize.BANNER
        }
      }
    }

    ReadableType.String, ReadableType.Number -> {
      val v = if (sizeDyn.type == ReadableType.Number) {
        sizeDyn.asDouble().toInt().toString()
      } else {
        sizeDyn.asString()
      }

      when (v) {
        "B", "BANNER", "320x50" -> size = AdSize.BANNER
        "M", "MEDIUM_RECTANGLE", "300x250" -> size = AdSize.MEDIUM_RECTANGLE
        "L", "LEADERBOARD", "728x90" -> size = AdSize.LEADERBOARD
        "S", "SMART" -> size = AdSize.getSmartBanner(view.context)
        "A", "ADAPTIVE" -> size = AdSize.getAdaptiveBannerInScreen(view.context)
        else -> size = AdSize.BANNER
      }
    }

    else -> {
      size = AdSize.BANNER
    }
  }

  view.size = size
}

  override fun onDropViewInstance(view: CASBannerView) {
    super.onDropViewInstance(view)
    managerWrapper.removeChangeListener(updateSubs[view] ?: "")
    view.destroy()
  }

  override fun onAdViewPresented(view: CASBannerView, info: AdImpression) {
    val map = WritableNativeMap()

    map.putMap("impression", info.toReadableMap())

    (view.context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(view.id, "onAdViewPresented", map)

    super.onAdViewPresented(view, info)
  }

  override fun onAdViewClicked(view: CASBannerView) {
    val map = WritableNativeMap()

    (view.context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(view.id, "onAdViewClicked", map)

    super.onAdViewClicked(view)
  }

  override fun onAdViewFailed(view: CASBannerView, error: AdError) {
  val map = WritableNativeMap()

  val errorMap = WritableNativeMap().apply {
    putInt("code", error.code)
    putString("message", error.message)
  }
  map.putMap("error", errorMap)

  (view.context as ThemedReactContext)
    .getJSModule(RCTEventEmitter::class.java)
    .receiveEvent(view.id, "onAdViewFailed", map)

  super.onAdViewFailed(view, error)
}


  override fun onAdViewLoaded(view: CASBannerView) {
    val map = WritableNativeMap()

    map.putInt("width", view.width)
    map.putInt("height", view.height)

    (view.context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(view.id, "onAdViewLoaded", map)

    super.onAdViewLoaded(view)
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> {
    return mapOf(
      "onAdViewLoaded" to mapOf(
        "phasedRegistrationNames" to mapOf(
          "bubbled" to "onAdViewLoaded"
        )
      ),
      "onAdViewFailed" to mapOf(
        "phasedRegistrationNames" to mapOf(
          "bubbled" to "onAdViewFailed"
        )
      ),
      "onAdViewClicked" to mapOf(
        "phasedRegistrationNames" to mapOf(
          "bubbled" to "onAdViewClicked"
        )
      ),
      "onAdViewPresented" to mapOf(
        "phasedRegistrationNames" to mapOf(
          "bubbled" to "onAdViewPresented"
        )
      ),
      "isAdReady" to mapOf(
        "phasedRegistrationNames" to mapOf(
          "bubbled" to "isAdReady"
        )
      )
    )
  }

  override fun getCommandsMap(): MutableMap<String, Int>? {
    return mutableMapOf(
      "isAdReady" to 0,
      "loadNextAd" to 1
    )
  }

  override fun receiveCommand(root: CASBannerView, commandId: String?, args: ReadableArray?) {
    Assertions.assertNotNull(commandId)

    when(commandId) {
      "isAdReady" -> {
        val map = WritableNativeMap()
        map.putBoolean("isAdReady", root.isAdReady)

        (root.context as ThemedReactContext)
          .getJSModule(RCTEventEmitter::class.java)
          .receiveEvent(root.id, "isAdReady", map)
      }
      "loadNextAd" -> root.loadNextAd()
    }
  }
}