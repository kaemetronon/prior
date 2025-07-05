package com.priority.tasktracker.task.domain.model

import com.priority.tasktracker.task.data.TagDto

data class TagTo(
    val id: Long? = null,
    val name: String
) {
    companion object {
        fun fromEntity(tag: TagDto) = TagDto(
            id = tag.id,
            name = tag.name
        )
    }
}