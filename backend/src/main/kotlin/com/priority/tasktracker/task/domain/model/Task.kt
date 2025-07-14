package com.priority.tasktracker.task.domain.model

import java.time.LocalDate

data class Task(
    val id: Long? = null,
    var title: String,
    var description: String? = null,
    var date: LocalDate,
    var tags: Set<String> = emptySet(),
    var importance: Int = 5,
    var urgency: Int = 5,
    var personalInterest: Int = 5,
    var executionTime: Int = 5,
    var complexity: Int = 5,
    var concentration: Int = 5,
    var blocked: Boolean = false,
    var completed: Boolean = false
)