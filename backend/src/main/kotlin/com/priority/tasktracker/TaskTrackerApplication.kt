package com.priority.tasktracker

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.scheduling.annotation.EnableScheduling

@EnableScheduling
@EnableCaching
@SpringBootApplication
class TaskTrackerApplication

fun main(args: Array<String>) {
    runApplication<TaskTrackerApplication>(*args)
}