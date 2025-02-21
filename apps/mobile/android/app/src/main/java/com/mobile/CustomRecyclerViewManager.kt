package com.mezon.mobile

import android.view.View
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class CustomRecyclerViewManager : ViewGroupManager<CustomRecyclerView>() {

    override fun getName(): String = "CustomRecyclerView"

    override fun createViewInstance(reactContext: ThemedReactContext): CustomRecyclerView {
        return CustomRecyclerView(reactContext)
    }

    @ReactProp(name = "data")
    fun setData(view: CustomRecyclerView, data: ReadableArray) {
        val list = mutableListOf<ChannelItem>()
        for (i in 0 until data.size()) {
            val item: ReadableMap = data.getMap(i) ?: continue
            val categoryId = item.getDouble("category_id").toLong()
            val categoryName = item.getString("category_name") ?: "Unknown"
            val channelId = if (item.hasKey("channel_id")) item.getDouble("channel_id").toLong() else null
            val channelLabel = item.getString("channel_label")
            val clanId = item.getDouble("clan_id").toLong()
            val creatorId = item.getDouble("creator_id").toLong()
            val unreadCount = if (item.hasKey("count_mess_unread")) item.getInt("count_mess_unread") else 0

            list.add(ChannelItem(categoryId, categoryName, channelId, channelLabel, clanId, creatorId, unreadCount))
        }
        view.setData(list)
    }

    override fun addView(parent: CustomRecyclerView, child: View, index: Int) {
        parent.addChildView(child, index)
    }

    override fun getChildAt(parent: CustomRecyclerView, index: Int): View? {
        return parent.getChildAtIndex(index)
    }

    override fun getChildCount(parent: CustomRecyclerView): Int {
        return (adapter as? CustomRecyclerViewAdapter)?.getViewHolderCount() ?: super.getChildCount()
    }
}

