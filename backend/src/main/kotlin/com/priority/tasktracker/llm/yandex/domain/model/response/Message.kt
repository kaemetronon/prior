package com.priority.tasktracker.llm.yandex.domain.model.response

data class Message(
    val role: String = "user",
    val text: String
)