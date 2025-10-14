package com.cleveradssolutions.plugin.reactnative.extensions

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

inline fun ReadableMap.has(key: String, cb: () -> Unit) {
  if (hasKey(key) && !isNull(key)) cb()
}

fun ReadableArray.toStringSet(): Set<String> =
  toArrayList().filterIsInstance<String>().toSet()

fun ReadableMap?.optBoolean(key: String, default: Boolean): Boolean =
  if (this != null && this.hasKey(key) && !this.isNull(key)) getBoolean(key) else default

fun ReadableMap?.optIntOrNull(key: String): Int? =
  if (this != null && this.hasKey(key) && !this.isNull(key)) getInt(key) else null

fun ReadableMap?.optStringList(key: String): List<String> {
  if (this == null || !hasKey(key) || isNull(key)) return emptyList()
  val arr: ReadableArray = getArray(key) ?: return emptyList()
  val out = ArrayList<String>(arr.size())
  for (i in 0 until arr.size()) {
    val v = arr.getString(i)
    if (v != null) out.add(v)
  }
  return out
}

fun ReadableMap?.optMap(key: String): ReadableMap? =
  if (this != null && hasKey(key) && !isNull(key)) getMap(key) else null
