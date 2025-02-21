package com.mezon.mobile

data class ChannelItem(
    val categoryId: Long,
    val categoryName: String,
    val channelId: Long?,
    val channelLabel: String?,
    val clanId: Long,
    val creatorId: Long,
    val unreadCount: Int
)
