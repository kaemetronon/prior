package com.priority.tasktracker.llm

import com.priority.tasktracker.task.domain.model.Task

interface LlmService {
    fun createTask(title: String, tasksContext: List<Task>): Task?
}