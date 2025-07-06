package com.priority.tasktracker.llm.yandex.domain

data class TaskParams(
    val urgency: Int,
    val personalInterest: Int,
    val executionTime: Int,
    val complexity: Int,
    val concentration: Int
) {
    constructor() : this(0, 0, 0, 0, 0)

    companion object {
        fun empty() = TaskParams(0, 0, 0, 0, 0)
    }
}
