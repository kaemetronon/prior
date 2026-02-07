package com.priority.tasktracker.task.data

import org.springframework.cache.annotation.Cacheable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface TaskRepository : JpaRepository<TaskDto, Long> {
    @Cacheable(value = ["tasksByDate"], key = "#date.toString()")
    fun findByDate(date: LocalDate): List<TaskDto>

    fun findDistinctByDateAndTagsNameIn(date: LocalDate, tagNames: Collection<String>): List<TaskDto>

    fun findDistinctByTagsNameIn(tagNames: Collection<String>): List<TaskDto>

    @Cacheable(value = ["tasks"], key = "'completed_' + #completed + '_date_' + #date.toString()")
    fun findByCompletedAndDateBefore(completed: Boolean, date: LocalDate): List<TaskDto>

    fun existsByTagsId(tagId: Long): Boolean
}
