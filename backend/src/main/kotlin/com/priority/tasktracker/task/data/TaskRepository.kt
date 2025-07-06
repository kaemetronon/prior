package com.priority.tasktracker.task.data

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface TaskRepository : JpaRepository<TaskDto, Long> {
    fun findByDate(date: LocalDate): List<TaskDto>
    fun findByCompletedAndDateBefore(completed: Boolean, date: LocalDate): List<TaskDto>
} 