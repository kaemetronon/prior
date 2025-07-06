package com.priority.tasktracker.llm.yandex.domain.model.request

data class YaMessage(
    val role: String = "user",
    val text: String
)