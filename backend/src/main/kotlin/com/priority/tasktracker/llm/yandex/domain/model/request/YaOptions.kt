package com.priority.tasktracker.llm.yandex.domain.model.request

data class YaOptions(
    val stream: Boolean = false,
    val temperature: Float = 0F,
    val maxTokens: Int = 5000
)
