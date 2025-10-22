package com.cleveradssolutions.plugin.reactnative.views

import android.content.Context
import android.view.ViewGroup
import com.cleveradssolutions.plugin.reactnative.CASMobileAdsModuleImpl
import com.cleveradssolutions.plugin.reactnative.toReadableMap
import com.cleveradssolutions.sdk.AdContentInfo
import com.cleveradssolutions.sdk.OnAdImpressionListener
import com.cleversolutions.ads.AdError
import com.cleversolutions.ads.AdViewListener
import com.cleversolutions.ads.android.CASBannerView
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.views.view.ReactViewGroup
import kotlin.math.roundToInt

class CASAdView(context: Context) :
  ReactViewGroup(context), AdViewListener, OnAdImpressionListener {

  val banner: CASBannerView = CASBannerView(context)
  var isAutoloadEnabled = true

  init {
    // Disable autoload until all props configuration
    banner.isAutoloadEnabled = false
    banner.casId = CASMobileAdsModuleImpl.casIdentifier

    layoutParams = LayoutParams(
      ViewGroup.LayoutParams.WRAP_CONTENT,
      ViewGroup.LayoutParams.WRAP_CONTENT
    )

    banner.layoutParams = LayoutParams(
      ViewGroup.LayoutParams.WRAP_CONTENT,
      ViewGroup.LayoutParams.WRAP_CONTENT
    )

    clipToPadding = false
    clipChildren = false

    banner.adListener = this
    banner.onImpressionListener = this

    addView(banner)
  }

  override fun onAdViewClicked(view: CASBannerView) {
    (context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(this.id, "onAdViewClicked", WritableNativeMap())
  }

  override fun onAdViewFailed(view: CASBannerView, error: AdError) {
    val map = WritableNativeMap().apply {
      putInt("code", error.code)
      putString("message", error.message)
    }
    (context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(this.id, "onAdViewFailed", map)
  }


  override fun onAdViewLoaded(view: CASBannerView) {
    val adSize = view.size
    var dpW = adSize.width
    var dpH = adSize.height
    view.getChildAt(0)?.layoutParams?.let {
      val density = view.context.resources.displayMetrics.density
      dpW = (it.width / density).roundToInt()
      dpH = (it.height / density).roundToInt()
    }

    val map = WritableNativeMap().apply {
      putInt("width", dpW)
      putInt("height", dpH)
    }
    (context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(this.id, "onAdViewLoaded", map)
  }

  override fun onAdImpression(ad: AdContentInfo) {
    (context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(this.id, "onAdViewImpression", ad.toReadableMap())
  }
}
