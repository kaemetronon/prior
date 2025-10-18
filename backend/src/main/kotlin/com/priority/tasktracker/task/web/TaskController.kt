package com.priority.tasktracker.task.web

import com.priority.tasktracker.task.domain.TaskService
import com.priority.tasktracker.task.domain.model.QuickTaskRequest
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/tasks")
class TaskController(private val taskService: TaskService) {

    @GetMapping
    fun getAllTasks(
        @RequestParam(defaultValue = "weight") sortBy: String,
        @RequestParam(defaultValue = "desc") sortOrder: String
    ): ResponseEntity<List<TaskTo>> =
        ResponseEntity.ok(taskService.getAllTasks(sortBy, sortOrder).map { it.toTaskTo() })

    @GetMapping("/date/{date}")
    fun getTasksByDate(
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
        @RequestParam(defaultValue = "weight") sortBy: String,
        @RequestParam(defaultValue = "desc") sortOrder: String
    ): ResponseEntity<List<TaskTo>> =
        ResponseEntity.ok(taskService.getTasksByDate(date, sortBy, sortOrder).map { it.toTaskTo() })

    @GetMapping("/{id}")
    fun getTaskById(@PathVariable id: Long): ResponseEntity<TaskTo> =
        ResponseEntity.ok(taskService.getTaskById(id).toTaskTo())

    @PostMapping
    fun createTask(@RequestBody task: TaskTo): ResponseEntity<TaskTo> =
        ResponseEntity.ok(
            taskService.createTask(task.toTask()).toTaskTo()
        )

    @PostMapping("/quick")
    fun createQuickTask(@RequestBody request: QuickTaskRequest): ResponseEntity<TaskTo> =
        ResponseEntity.ok(
            taskService.createQuickTask(request.title).toTaskTo()
        )

    @PostMapping("/quick/llm")
    fun createQuickLlmTask(@RequestBody request: QuickTaskRequest): ResponseEntity<TaskTo> =
        ResponseEntity.ok(
            taskService.createQuickLlmTask(request.title)?.toTaskTo()
        )

    @PutMapping("/{id}")
    fun updateTask(@PathVariable id: Long, @RequestBody taskDto: TaskTo): ResponseEntity<TaskTo> =
        ResponseEntity.ok(
            taskService.updateTask(taskDto.toTask(id)).toTaskTo()
        )

    @DeleteMapping("/{id}")
    fun deleteTask(@PathVariable id: Long): ResponseEntity<Unit> {
        taskService.deleteTask(id)
        return ResponseEntity.noContent().build()
    }
} 