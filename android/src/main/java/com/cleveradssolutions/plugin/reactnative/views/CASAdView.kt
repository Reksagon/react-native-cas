package com.cleveradssolutions.plugin.reactnative.views

import android.content.Context
import android.util.TypedValue
import android.view.Gravity
import android.view.ViewGroup
import android.widget.FrameLayout
import com.cleveradssolutions.plugin.reactnative.extensions.toReadableMap
import com.cleveradssolutions.sdk.AdContentInfo
import com.cleveradssolutions.sdk.OnAdImpressionListener
import com.cleversolutions.ads.AdError
import com.cleversolutions.ads.AdSize
import com.cleversolutions.ads.android.CASBannerView
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import kotlin.math.max
import kotlin.math.roundToInt

class CASAdView(context: Context) :
  FrameLayout(context),
  com.cleversolutions.ads.AdViewListener, OnAdImpressionListener {

  val banner: CASBannerView = CASBannerView(context)

  var loadOnMount: Boolean = true
  var size: AdSize = AdSize.BANNER
  private var refreshIntervalSec: Int = 30
  private var refreshWasEnabledByProps: Boolean = true
  var casId: String? = null

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
    banner.onImpressionListener = this

    addView(banner)
  }

  private fun dp(v: Int): Int =
    TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics)
      .roundToInt()


  private fun measureAndLayoutChild() {
    val w = width.takeIf { it > 0 } ?: measuredWidth
    val h = height.takeIf { it > 0 } ?: measuredHeight
    if (w <= 0 || h <= 0) return

    val ws = MeasureSpec.makeMeasureSpec(w, MeasureSpec.AT_MOST)
    val hs = MeasureSpec.makeMeasureSpec(h, MeasureSpec.AT_MOST)
    banner.measure(ws, hs)

    val left = max(0, (w - banner.measuredWidth) / 2)
    val top = 0
    banner.layout(left, top, left + banner.measuredWidth, top + banner.measuredHeight)
  }

  override fun requestLayout() {
    super.requestLayout()
    post { measureAndLayoutChild() }
  }

  fun applyProps() {
    banner.size = size
    minimumHeight = 1
    minimumWidth = 1

    if (refreshIntervalSec <= 0) {
      banner.disableAdRefresh()
    } else {
      banner.refreshInterval = refreshIntervalSec
    }
    requestLayout()
  }

  fun setRefreshInterval(seconds: Int) {
    refreshIntervalSec = seconds
    if (seconds <= 0) {
      banner.disableAdRefresh()
    } else {
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
    banner.refreshInterval = refreshIntervalSec
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
    requestLayout()

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
    val map = WritableNativeMap().apply { putMap("impression", ad.toReadableMap()) }
    (context as ThemedReactContext)
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(this.id, "onAdViewImpression", map)
  }
}
