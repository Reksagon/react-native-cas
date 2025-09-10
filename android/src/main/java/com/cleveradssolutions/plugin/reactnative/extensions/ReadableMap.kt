package com.cleveradssolutions.plugin.reactnative.extensions

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

fun ReadableMap.getStringOrEmpty(key: String): String =
  if (hasKey(key) && !isNull(key)) getString(key) ?: "" else ""

fun ReadableMap.getDoubleOrZero(key: String): Double =
  if (hasKey(key) && !isNull(key)) getDouble(key) else 0.0

fun ReadableMap.getIntOrZero(key: String): Int =
  if (hasKey(key) && !isNull(key)) getInt(key) else 0

inline fun ReadableMap.has(key: String, cb: () -> Unit) {
  if (hasKey(key) && !isNull(key)) cb()
}

fun ReadableArray.toStringSet(): Set<String> =
  toArrayList().filterIsInstance<String>().toSet()
