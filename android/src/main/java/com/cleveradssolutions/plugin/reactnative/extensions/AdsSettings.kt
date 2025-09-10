package com.cleveradssolutions.plugin.reactnative.extensions

import com.cleversolutions.ads.AdsSettings
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.ReadableMap as RNReadableMap

fun AdsSettings.toReadableMap(): RNReadableMap {
  val map = WritableNativeMap()

  map.putInt("taggedAudience", this.taggedAudience)
  map.putBoolean("debugMode", this.debugMode)
  map.putBoolean("mutedAdSounds", this.mutedAdSounds)

  try {
    val f = this::class.java.getDeclaredField("trackLocation")
    f.isAccessible = true
    val enabled = (f.get(this) as? Boolean) == true
    map.putBoolean("locationCollectionEnabled", enabled)
  } catch (_: Throwable) {}

  val tdi = WritableNativeArray()
  (this.testDeviceIDs ?: emptySet()).forEach { tdi.pushString(it) }
  map.putArray("testDeviceIDs", tdi)

  return map
}

fun AdsSettings.fromReadableMap(map: ReadableMap) {
  map.has("taggedAudience") { this.taggedAudience = map.getInt("taggedAudience") }
  map.has("debugMode") { this.debugMode = map.getBoolean("debugMode") }
  map.has("mutedAdSounds") { this.mutedAdSounds = map.getBoolean("mutedAdSounds") }

  map.has("locationCollectionEnabled") {
    try {
      val f = this::class.java.getDeclaredField("trackLocation")
      f.isAccessible = true
      f.setBoolean(this, map.getBoolean("locationCollectionEnabled"))
    } catch (_: Throwable) {}
  }

  map.has("testDeviceIDs") {
    this.testDeviceIDs = map.getArray("testDeviceIDs")?.toStringSet() ?: emptySet()
  }
}
