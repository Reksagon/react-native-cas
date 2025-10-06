package com.cleveradssolutions.plugin.reactnative.views

import android.content.Context
import android.util.TypedValue
import android.view.ViewGroup
import android.widget.FrameLayout
import com.cleveradssolutions.plugin.reactnative.extensions.toReadableMap
import com.cleveradssolutions.sdk.OnAdImpressionListener
import com.cleversolutions.ads.AdError
import com.cleversolutions.ads.AdSize
import com.cleversolutions.ads.android.CASBannerView
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import kotlin.math.roundToInt

class CASAdView(context: Context) :
  FrameLayout(context),
  com.cleversolutions.ads.AdViewListener {

  val banner: CASBannerView = CASBannerView(context)

  var loadOnMount: Boolean = true
  var autoRefresh: Boolean = true
  var size: AdSize = AdSize.BANNER
  private var refreshIntervalSec: Int = 30
  private var refreshWasEnabledByProps: Boolean = true

  init {
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
    banner.onImpressionListener = OnAdImpressionListener { ad ->
      val map = WritableNativeMap().apply { putMap("impression", ad.toReadableMap()) }
      (context as ThemedReactContext)
        .getJSModule(RCTEventEmitter::class.java)
        .receiveEvent(this.id, "onAdViewImpression", map)
    }

    addView(banner)
  }

  private fun dp(v: Int): Int =
    TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics).roundToInt()

  private fun fallbackHeightPx(): Int = when (size) {
    AdSize.MEDIUM_RECTANGLE -> dp(250)
    AdSize.LEADERBOARD -> dp(90)
    else -> dp(50)
  }

  private fun fallbackWidthPx(): Int = when (size) {
    AdSize.MEDIUM_RECTANGLE -> dp(300)
    AdSize.LEADERBOARD -> dp(728)
    else -> dp(320)
  }

  private fun measureAndLayoutChild() {
    val w = width.takeIf { it > 0 } ?: measuredWidth
    val h = height.takeIf { it > 0 } ?: measuredHeight
    if (w <= 0 || h <= 0) return

    val ws = MeasureSpec.makeMeasureSpec(w, MeasureSpec.AT_MOST)
    val hs = MeasureSpec.makeMeasureSpec(h, MeasureSpec.AT_MOST)
    banner.measure(ws, hs)
    banner.layout(0, 0, banner.measuredWidth, banner.measuredHeight)
  }

  override fun requestLayout() {
    super.requestLayout()
    post { measureAndLayoutChild() }
  }

  fun applyProps() {
    banner.size = size
    minimumHeight = fallbackHeightPx()
    minimumWidth = 1

    if (!autoRefresh) {
      refreshWasEnabledByProps = false
      banner.disableAdRefresh()
    } else {
      refreshWasEnabledByProps = true
      if (refreshIntervalSec > 0) banner.refreshInterval = refreshIntervalSec
    }

    requestLayout()
  }

  fun setRefreshInterval(seconds: Int) {
    refreshIntervalSec = seconds
    if (seconds <= 0) {
      banner.disableAdRefresh()
    } else if (autoRefresh) {
      banner.refreshInterval = seconds
    }
  }

  fun isLoaded(): Boolean = banner.isLoaded
  fun load() = banner.load()
  fun destroyView() = banner.destroy()

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    banner.disableAdRefresh()
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    if (refreshWasEnabledByProps && refreshIntervalSec > 0) {
      banner.refreshInterval = refreshIntervalSec
    }
    post { measureAndLayoutChild() }
  }

  override fun onAdViewClicked(view: CASBannerView) {
    (context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(this.id, "onAdViewClicked", WritableNativeMap())
  }

  override fun onAdViewFailed(view: CASBannerView, error: AdError) {
    val map = WritableNativeMap().apply {
      putMap("error", WritableNativeMap().apply {
        putInt("code", error.code)
        putString("message", error.message)
      })
    }
    (context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(this.id, "onAdViewFailed", map)
  }

  override fun onAdViewLoaded(view: CASBannerView) {
    val mw = if (banner.measuredWidth > 0) banner.measuredWidth else fallbackWidthPx()
    val mh = if (banner.measuredHeight > 0) banner.measuredHeight else fallbackHeightPx()

    requestLayout()
    emitLoaded(mw, mh)
  }

  private fun emitLoaded(w: Int, h: Int) {
    val map = WritableNativeMap().apply {
      putInt("width",  if (w > 0) w else fallbackWidthPx())
      putInt("height", if (h > 0) h else fallbackHeightPx())
    }
    (context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(this.id, "onAdViewLoaded", map)
  }
}
