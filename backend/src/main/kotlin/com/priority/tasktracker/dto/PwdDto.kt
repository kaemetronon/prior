package com.priority.tasktracker.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class PwdDto(
    @JsonProperty("pwd")
    val pwd: String
)
