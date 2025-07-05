package com.priority.tasktracker.task.domain.model

import com.priority.tasktracker.task.data.Task
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