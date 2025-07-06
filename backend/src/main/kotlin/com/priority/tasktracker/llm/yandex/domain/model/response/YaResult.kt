package com.priority.tasktracker.llm.yandex.domain.model.response

data class YaResult(
    val alternatives: List<Alternative>,
    val usage: Usage,
    val modelVersion: String
)
