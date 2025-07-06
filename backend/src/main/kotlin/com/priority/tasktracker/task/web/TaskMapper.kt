package com.priority.tasktracker.task.web

import com.priority.tasktracker.task.domain.model.Task

fun Task.toTaskTo(): TaskTo =
    TaskTo(
        id = id,
        title = title,
        description = description,
        date = date,
        tags = tags,
        urgency = urgency,
        personalInterest = personalInterest,
        executionTime = executionTime,
        complexity = complexity,
        concentration = concentration,
        blocked = blocked,
        completed = completed
    )

fun TaskTo.toTask(id: Long? = null): Task =
    Task(
        id = id,
        title = title,
        description = description,
        date = date,
        tags = tags,
        urgency = urgency,
        personalInterest = personalInterest,
        executionTime = executionTime,
        complexity = complexity,
        concentration = concentration,
        blocked = blocked,
        completed = completed
    )