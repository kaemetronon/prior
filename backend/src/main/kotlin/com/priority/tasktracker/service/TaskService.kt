package com.priority.tasktracker.service

import com.priority.tasktracker.config.WithLogging
import com.priority.tasktracker.model.Tag
import com.priority.tasktracker.model.Task
import com.priority.tasktracker.repository.TagRepository
import com.priority.tasktracker.repository.TaskRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.ZoneId

@Service
@Transactional
class TaskService(
    private val taskRepository: TaskRepository,
    private val tagRepository: TagRepository
) {
    fun getAllTasks(): List<Task> = taskRepository.findAll()

    fun getTasksByDate(date: LocalDate): List<Task> =
        taskRepository.findByDate(date)

    fun getTaskById(id: Long): Task = taskRepository.findById(id)
        .orElseThrow { NoSuchElementException("Task not found with id: $id") }

    private fun getOrCreateTags(tagNames: Set<String>): Set<Tag> {
        return tagNames.map { name ->
            tagRepository.findByName(name) ?: tagRepository.save(Tag(name = name))
        }.toSet()
    }

    fun createTask(task: Task): Task {
        // Ensure default values are set
        task.apply {
            if (urgency < 1) urgency = 1
            if (urgency > 10) urgency = 10
            if (personalInterest < 1) personalInterest = 1
            if (personalInterest > 10) personalInterest = 10
            if (executionTime < 1) executionTime = 1
            if (executionTime > 10) executionTime = 10
            if (complexity < 1) complexity = 1
            if (complexity > 10) complexity = 10
        }
        return taskRepository.save(task)
    }

    fun updateTask(id: Long, updatedTask: Task): Task {
        val existingTask = getTaskById(id)

        existingTask.apply {
            title = updatedTask.title
            description = updatedTask.description
            date = updatedTask.date
            urgency = updatedTask.urgency.coerceIn(1, 10)
            personalInterest = updatedTask.personalInterest.coerceIn(1, 10)
            executionTime = updatedTask.executionTime.coerceIn(1, 10)
            complexity = updatedTask.complexity.coerceIn(1, 10)
            blocked = updatedTask.blocked
            completed = updatedTask.completed
        }

        return taskRepository.save(existingTask)
    }

    fun deleteTask(id: Long) {
        if (!taskRepository.existsById(id)) {
            throw NoSuchElementException("Task not found with id: $id")
        }
        taskRepository.deleteById(id)
    }

    @Scheduled(cron = "0 0 0 * * *", zone = "Europe/Moscow")
    fun postponeOpenTasksToNextDay() {
        logger.info("Move open tasks to next day")
        val today = LocalDate.now(ZoneId.of("Europe/Moscow"))
        val openTasks = taskRepository.findByCompletedAndDateBefore(false, today)
        openTasks.forEach { task ->
            val oldDate = task.date
            task.date = today
            val note = "[Перенесено с ${oldDate}]"
            task.description = (task.description?.let { "$it\n$note" } ?: note)
            taskRepository.save(task)
        }
    }

    companion object : WithLogging()
} 