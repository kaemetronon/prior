package com.priority.tasktracker.llm.yandex.domain.model.response

data class Usage(
    val inputTextTokens: Int,
    val completionTokens: Int,
    val totalTokens: Int,
    val completionTokensDetails: CompletionTokensDetails? = null
)