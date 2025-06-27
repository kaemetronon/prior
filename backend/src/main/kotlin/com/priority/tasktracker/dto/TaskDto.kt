package com.priority.tasktracker.dto

import com.priority.tasktracker.model.Task
import com.priority.tasktracker.model.Tag
import java.time.LocalDate

data class TaskDto(
    val id: Long? = null,
    val title: String,
    val description: String? = null,
    val date: LocalDate,
    val tagNames: Set<String> = emptySet(),
    val urgency: Int = 3,
    val personalInterest: Int = 3,
    val executionTime: Int = 3,
    val complexity: Int = 3,
    val concentration: Int = 3,
    val blocked: Boolean = false,
    val completed: Boolean = false
) {
    companion object {
        fun fromEntity(task: Task) = TaskDto(
            id = task.id,
            title = task.title,
            description = task.description,
            date = task.date,
            tagNames = task.tags.map { it.name }.toSet(),
            urgency = task.urgency,
            personalInterest = task.personalInterest,
            executionTime = task.executionTime,
            complexity = task.complexity,
            concentration = task.concentration,
            blocked = task.blocked,
            completed = task.completed
        )
    }
}

data class TagDto(
    val id: Long? = null,
    val name: String
) {
    companion object {
        fun fromEntity(tag: Tag) = TagDto(
            id = tag.id,
            name = tag.name
        )
    }
}