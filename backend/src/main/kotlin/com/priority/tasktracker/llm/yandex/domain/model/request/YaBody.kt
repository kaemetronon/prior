package com.priority.tasktracker.llm.yandex.domain.model.request

import com.priority.tasktracker.llm.yandex.domain.model.response.Message

data class YaBody(
    val modelUri: String,
    val completionOptions: YaOptions,
    val messages: MutableList<Message>
)
