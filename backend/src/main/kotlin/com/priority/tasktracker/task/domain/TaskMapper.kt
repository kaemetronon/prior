package com.priority.tasktracker.task.domain

import com.priority.tasktracker.task.data.TagDto
import com.priority.tasktracker.task.data.TaskDto
import com.priority.tasktracker.task.domain.model.Task

fun TaskDto.toTask(): Task =
    Task(
        id = id,
        title = title,
        description = description,
        date = date,
        tags = tags.map { it.toTagName() }.toSet(),
        urgency = urgency,
        personalInterest = personalInterest,
        executionTime = executionTime,
        complexity = complexity,
        concentration = concentration,
        blocked = blocked,
        completed = completed
    )

fun TagDto.toTagName(): String = name

fun Task.toTaskDto(): TaskDto =
    TaskDto(
        id = id,
        title = title,
        description = description,
        date = date,
        tags = mutableSetOf(), // todo исправить сохранение тегов при создании таски
        urgency = urgency,
        personalInterest = personalInterest,
        executionTime = executionTime,
        complexity = complexity,
        concentration = concentration,
        blocked = blocked,
        completed = completed
    )