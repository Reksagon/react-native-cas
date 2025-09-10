package com.cleveradssolutions.plugin.reactnative.extensions

import com.cleveradssolutions.sdk.AdContentInfo
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap

private fun accuracyToLabel(a: Int): String = when (a) {
  2 -> "bid"
  1 -> "floor"
  else -> "unknown"
}

fun AdContentInfo.toReadableMap(): ReadableMap {
  val map = WritableNativeMap()
  map.putString("format", this.format.label)
  map.putDouble("revenue", this.revenue)
  map.putString("revenuePrecision", accuracyToLabel(this.revenuePrecision))
  map.putString("sourceUnitId", this.sourceUnitId)
  map.putString("sourceName", this.sourceName)
  this.creativeId?.let { map.putString("creativeId", it) }
  map.putDouble("revenueTotal", this.revenueTotal)
  map.putInt("impressionDepth", this.impressionDepth)
  return map
}
