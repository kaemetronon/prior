package com.priority.tasktracker.task.data

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TagRepository : JpaRepository<TagDto, Long> {
    fun findByName(name: String): TagDto?
} 