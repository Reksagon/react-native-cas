package com.cleveradssolutions.plugin.reactnative.extensions

import com.cleveradssolutions.sdk.AdContentInfo
import com.cleveradssolutions.sdk.AdRevenuePrecision
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap

private fun precisionToLabel(p: Int): String = when (p) {
  AdRevenuePrecision.PRECISE -> "precise"
  AdRevenuePrecision.FLOOR -> "floor"
  AdRevenuePrecision.ESTIMATED -> "estimated"
  else -> "unknown"
}

fun AdContentInfo.toReadableMap(): WritableMap {
  val map = WritableNativeMap()
  map.putString("format", this.format.label)
  map.putDouble("revenue", this.revenue)
  map.putString("revenuePrecision", precisionToLabel(this.revenuePrecision))
  map.putString("sourceUnitId", this.sourceUnitId)
  map.putString("sourceName", this.sourceName)
  this.creativeId?.let { map.putString("creativeId", it) }
  map.putDouble("revenueTotal", this.revenueTotal)
  map.putInt("impressionDepth", this.impressionDepth)
  return map
}
