package com.priority.tasktracker.utils

import java.time.LocalDate
import java.time.ZoneId

class DateUtils {
    companion object {
        fun mskLocalDate(): LocalDate =
            LocalDate.now(ZoneId.of("Europe/Moscow"))
    }
}