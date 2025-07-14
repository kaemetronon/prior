package com.priority.tasktracker.task.web

import java.time.LocalDate

data class TaskTo(
    val id: Long?,
    val title: String,
    val description: String?,
    val date: LocalDate,
    val tags: Set<String>,
    val importance: Int,
    val urgency: Int,
    val personalInterest: Int,
    val executionTime: Int,
    val complexity: Int,
    val concentration: Int,
    val blocked: Boolean,
    val completed: Boolean
)