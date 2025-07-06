package com.priority.tasktracker.task.domain.model

import java.time.LocalDate

data class Task(
    val id: Long?,
    var title: String,
    var description: String?,
    var date: LocalDate,
    var tags: Set<String>,
    var urgency: Int,
    var personalInterest: Int,
    var executionTime: Int,
    var complexity: Int,
    var concentration: Int,
    var blocked: Boolean,
    var completed: Boolean
)