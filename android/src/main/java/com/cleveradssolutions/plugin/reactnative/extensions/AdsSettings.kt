package com.cleveradssolutions.plugin.reactnative.extensions

import com.cleversolutions.ads.AdsSettings
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap

fun AdsSettings.toReadableMap(): ReadableMap {
  val map = WritableNativeMap()
  map.putInt("taggedAudience", this.taggedAudience)
  map.putInt("userConsent", this.userConsent)
  map.putInt("ccpaStatus", this.ccpaStatus)
  map.putBoolean("debugMode", this.debugMode)
  map.putBoolean("mutedAdSounds", this.mutedAdSounds)
  map.putInt("loadingMode", this.loadingMode)
  map.putInt("trialAdFreeInterval", this.trialAdFreeInterval)

  val array = WritableNativeArray()
  this.testDeviceIDs.forEach { array.pushString(it) }
  map.putArray("testDeviceIDs", array)

  return map
}

fun AdsSettings.fromReadableMap(map: ReadableMap) {
  map.has("taggedAudience") { this.taggedAudience = map.getInt("taggedAudience") }
  map.has("userConsent") { this.userConsent = map.getInt("userConsent") }
  map.has("ccpaStatus") { this.ccpaStatus = map.getInt("ccpaStatus") }
  map.has("debugMode") { this.debugMode = map.getBoolean("debugMode") }
  map.has("mutedAdSounds") { this.mutedAdSounds = map.getBoolean("mutedAdSounds") }
  map.has("loadingMode") { this.loadingMode = map.getInt("loadingMode") }
  map.has("trialAdFreeInterval") { this.trialAdFreeInterval = map.getInt("trialAdFreeInterval") }
  map.has("testDeviceIDs") { this.testDeviceIDs = map.getArray("testDeviceIDs")?.toStringSet() ?: emptySet() }
}
