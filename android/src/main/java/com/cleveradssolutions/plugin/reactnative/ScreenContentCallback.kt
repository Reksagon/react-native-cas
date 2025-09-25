package com.cleveradssolutions.plugin.reactnative

import com.cleveradssolutions.sdk.AdContentInfo
import com.cleveradssolutions.sdk.AdFormat
import com.cleveradssolutions.sdk.screen.ScreenAdContentCallback
import com.cleversolutions.ads.AdError
import com.facebook.react.bridge.WritableNativeMap

class ScreenContentCallback(
  private val adType: String,
  private val emit: (String, WritableNativeMap) -> Unit,
  private val onLoadResolved: ((success: Boolean, error: AdError?) -> Unit)? = null,
  private val onShowResolved: ((success: Boolean, error: AdError?) -> Unit)? = null
) : ScreenAdContentCallback() {

  override fun onAdLoaded(adInfo: AdContentInfo) {
    emit("adLoaded", WritableNativeMap().apply { putString("type", adType) })
    onLoadResolved?.invoke(true, null)
  }

  override fun onAdFailedToLoad(format: AdFormat, error: AdError) {
    emit("adFailedToLoad", WritableNativeMap().apply {
      putString("type", adType)
      putInt("errorCode", error.code)
      putString("errorMessage", error.message)
    })
    onLoadResolved?.invoke(false, error)
  }

  override fun onAdShowed(adInfo: AdContentInfo) {
    emit("onShown", WritableNativeMap().apply { putString("type", adType) })
  }

  override fun onAdFailedToShow(format: AdFormat, error: AdError) {
    emit("onShowFailed", WritableNativeMap().apply {
      putString("type", adType)
      putInt("errorCode", error.code)
      putString("errorMessage", error.message)
    })
    onShowResolved?.invoke(false, error)
  }

  override fun onAdClicked(adInfo: AdContentInfo) {
    emit("onClicked", WritableNativeMap().apply { putString("type", adType) })
  }

  override fun onAdDismissed(adInfo: AdContentInfo) {
    emit("onClosed", WritableNativeMap().apply { putString("type", adType) })
    onShowResolved?.invoke(true, null)
  }
}
