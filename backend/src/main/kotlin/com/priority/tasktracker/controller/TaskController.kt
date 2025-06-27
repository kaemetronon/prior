package com.priority.tasktracker.controller

import com.priority.tasktracker.dto.TaskDto
import com.priority.tasktracker.model.Task
import com.priority.tasktracker.service.TaskService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/tasks")
class TaskController(private val taskService: TaskService) {

    @GetMapping
    fun getAllTasks(): ResponseEntity<List<TaskDto>> =
        ResponseEntity.ok(taskService.getAllTasks().map { TaskDto.fromEntity(it) })

    @GetMapping("/date/{date}")
    fun getTasksByDate(
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): ResponseEntity<List<TaskDto>> =
        ResponseEntity.ok(taskService.getTasksByDate(date).map { TaskDto.fromEntity(it) })

    @GetMapping("/{id}")
    fun getTaskById(@PathVariable id: Long): ResponseEntity<TaskDto> =
        ResponseEntity.ok(TaskDto.fromEntity(taskService.getTaskById(id)))

    @PostMapping
    fun createTask(@RequestBody taskDto: TaskDto): ResponseEntity<TaskDto> {
        val task = Task(
            title = taskDto.title,
            description = taskDto.description,
            date = taskDto.date,
            urgency = taskDto.urgency,
            personalInterest = taskDto.personalInterest,
            executionTime = taskDto.executionTime,
            complexity = taskDto.complexity,
            concentration = taskDto.concentration,
            blocked = taskDto.blocked,
            completed = taskDto.completed
        )
        return ResponseEntity.ok(TaskDto.fromEntity(taskService.createTask(task)))
    }

    @PutMapping("/{id}")
    fun updateTask(@PathVariable id: Long, @RequestBody taskDto: TaskDto): ResponseEntity<TaskDto> {
        val task = Task(
            title = taskDto.title,
            description = taskDto.description,
            date = taskDto.date,
            urgency = taskDto.urgency,
            personalInterest = taskDto.personalInterest,
            executionTime = taskDto.executionTime,
            complexity = taskDto.complexity,
            concentration = taskDto.concentration,
            blocked = taskDto.blocked,
            completed = taskDto.completed
        )
        return ResponseEntity.ok(TaskDto.fromEntity(taskService.updateTask(id, task)))
    }

    @DeleteMapping("/{id}")
    fun deleteTask(@PathVariable id: Long): ResponseEntity<Unit> {
        taskService.deleteTask(id)
        return ResponseEntity.noContent().build()
    }
} 