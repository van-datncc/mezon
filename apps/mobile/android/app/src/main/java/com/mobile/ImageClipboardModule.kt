package com.mezon.mobile

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileOutputStream

class ImageClipboardModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ImageClipboardModule"
    }

    @ReactMethod
    fun setImage(base64String: String, promise: Promise) {
        try {
            val decodedBytes = Base64.decode(base64String, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)

            // Save to app's cache directory
            val cacheDir = reactApplicationContext.cacheDir
            val imageFile = File(cacheDir, "clipboard_image.png")

            val fos = FileOutputStream(imageFile)
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos)
            fos.close()

            // Create content URI using FileProvider
            val contentUri = FileProvider.getUriForFile(
                reactApplicationContext,
                "${reactApplicationContext.packageName}.fileprovider",
                imageFile
            )

            // Set to clipboard
            val clipboard = reactApplicationContext.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

            val clip = ClipData.newUri(
                reactApplicationContext.contentResolver,
                "Image",
                contentUri
            )
            clipboard.setPrimaryClip(clip)

            promise.resolve("Success")
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getImage(promise: Promise) {
        try {
            val clipboard = reactApplicationContext.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

            if (clipboard.hasPrimaryClip()) {
                val clipData = clipboard.primaryClip
                if (clipData != null && clipData.itemCount > 0) {
                    val item = clipData.getItemAt(0)
                    val uri = item.uri
                    promise.resolve(uri?.toString())
                } else {
                    promise.resolve(null)
                }
            } else {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}