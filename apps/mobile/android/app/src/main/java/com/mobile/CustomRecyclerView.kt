package com.mezon.mobile

import android.content.Context
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class CustomRecyclerView(context: Context) : RecyclerView(context) {
    private val adapter = CustomRecyclerViewAdapter(context as com.facebook.react.bridge.ReactContext, emptyList())

    init {
        layoutManager = LinearLayoutManager(context)
        setAdapter(adapter)
    }

    fun setData(data: List<ChannelItem>) {
        (adapter as? CustomRecyclerViewAdapter)?.apply {
            notifyDataSetChanged()
        }
    }

    fun addChildView(view: View, index: Int) {
        (adapter as? CustomRecyclerViewAdapter)?.apply {
            notifyItemInserted(index)
        }
    }

    fun getChildAtIndex(index: Int): View? {
        return (adapter as? CustomRecyclerViewAdapter)?.getViewHolderAt(index)
    }

    fun getChildCount(): Int {
        return (adapter as? CustomRecyclerViewAdapter)?.getViewHolderCount() ?: 0
    }
    fun getCustomChildCount(): Int {
        return (adapter as? CustomRecyclerViewAdapter)?.getViewHolderCount() ?: 0
    }
}
