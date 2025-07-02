package com.priority.tasktracker.auth.domain

import com.fasterxml.jackson.annotation.JsonProperty

data class PwdDto(
    @JsonProperty("pwd")
    val pwd: String
)