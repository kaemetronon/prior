package com.priority.tasktracker.task.domain

import com.priority.tasktracker.task.data.TagDto
import com.priority.tasktracker.task.data.TagRepository
import com.priority.tasktracker.task.data.TaskRepository
import com.priority.tasktracker.task.domain.model.Task
import com.priority.tasktracker.utils.WithLogging
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.ZoneId

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val tagRepository: TagRepository
) {
    fun getAllTasks(): List<Task> =
        taskRepository.findAll().map { it.toTask() }

    fun getTasksByDate(date: LocalDate): List<Task> =
        taskRepository.findByDate(date).map { it.toTask() }

    fun getTaskById(id: Long): Task = taskRepository.findById(id).map { it.toTask() }
        .orElseThrow { NoSuchElementException("Task not found with id: $id") }

    private fun getOrCreateTags(tagNames: Set<String>): Set<TagDto> {
        return tagNames.map { name ->
            tagRepository.findByName(name) ?: tagRepository.save(TagDto(name = name))
        }.toSet()
    }

    fun createTask(task: Task): Task =
        taskRepository.save(
            applyEdgeParams(task).toTaskDto()
        ).toTask()

    private fun applyEdgeParams(task: Task): Task =
        task.apply {
            urgency = urgency.coerceIn(1, 10)
            personalInterest = personalInterest.coerceIn(1, 10)
            executionTime = executionTime.coerceIn(1, 10)
            complexity = complexity.coerceIn(1, 10)
            concentration = concentration.coerceIn(1, 10)
        }


    fun createQuickTask(title: String): Task {
        val task = Task(
            id = null,
            title = title,
            description = null,
            date = LocalDate.now(ZoneId.of("Europe/Moscow")),
            tags = emptySet(),
            urgency = 10,
            personalInterest = 10,
            executionTime = 10,
            complexity = 10,
            concentration = 10,
            blocked = false,
            completed = false
        )
        return taskRepository.save(task.toTaskDto()).toTask()
    }

    fun createQuickLlmTask(title: String): Task {
        return Task(
            id = null,
            title = title,
            description = null,
            date = LocalDate.now(ZoneId.of("Europe/Moscow")),
            tags = emptySet(),
            urgency = 10,
            personalInterest = 10,
            executionTime = 10,
            complexity = 10,
            concentration = 10,
            blocked = false,
            completed = false
        )
    }

    fun updateTask(updatedTask: Task): Task {
        val existingTask = getTaskById(updatedTask.id!!)

        existingTask.apply {
            title = updatedTask.title
            description = updatedTask.description
            date = updatedTask.date
            urgency = updatedTask.urgency.coerceIn(1, 10)
            personalInterest = updatedTask.personalInterest.coerceIn(1, 10)
            executionTime = updatedTask.executionTime.coerceIn(1, 10)
            complexity = updatedTask.complexity.coerceIn(1, 10)
            concentration = updatedTask.concentration.coerceIn(1, 10)
            blocked = updatedTask.blocked
            completed = updatedTask.completed
        }

        return taskRepository.save(existingTask.toTaskDto()).toTask()
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
            logger.info("${task.title} $note")
            taskRepository.save(task)
        }
    }

    companion object : WithLogging()
}