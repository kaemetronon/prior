package com.priority.tasktracker.repository

import com.priority.tasktracker.model.Task
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface TaskRepository : JpaRepository<Task, Long> {
    fun findByDate(date: LocalDate): List<Task>
    fun findByCompletedAndDateBefore(completed: Boolean, date: LocalDate): List<Task>
} 