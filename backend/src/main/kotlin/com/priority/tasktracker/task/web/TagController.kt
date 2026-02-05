package com.priority.tasktracker.task.web

import com.priority.tasktracker.task.data.TagRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/tags")
class TagController(private val tagRepository: TagRepository) {

    @GetMapping
    fun getAllTags(): ResponseEntity<List<String>> =
        ResponseEntity.ok(
            tagRepository.findAll()
                .map { it.name }
                .distinct()
                .sorted()
        )
}
