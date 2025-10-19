package com.priority.tasktracker.task.domain

import com.priority.tasktracker.llm.LlmService
import com.priority.tasktracker.task.data.TagDto
import com.priority.tasktracker.task.data.TagRepository
import com.priority.tasktracker.task.data.TaskRepository
import com.priority.tasktracker.task.domain.model.Task
import com.priority.tasktracker.utils.DateUtils.Companion.mskLocalDate
import com.priority.tasktracker.utils.WithLogging
import org.springframework.cache.annotation.CacheEvict
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.ZoneId

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val tagRepository: TagRepository,
    private val llmService: LlmService
) {
    fun getAllTasks(sortBy: String = "weight", sortOrder: String = "desc"): List<Task> =
        taskRepository.findAll().map { it.toTask() }.let { tasks ->
            sortTasks(tasks, sortBy, sortOrder)
        }

    fun getTasksByDate(date: LocalDate, sortBy: String = "weight", sortOrder: String = "desc"): List<Task> =
        taskRepository.findByDate(date).map { it.toTask() }.let { tasks ->
            sortTasks(tasks, sortBy, sortOrder)
        }

    fun getTaskById(id: Long): Task = taskRepository.findById(id).map { it.toTask() }
        .orElseThrow { NoSuchElementException("Task not found with id: $id") }

    private fun getOrCreateTags(tagNames: Set<String>): Set<TagDto> {
        return tagNames.map { name ->
            tagRepository.findByName(name) ?: tagRepository.save(TagDto(name = name))
        }.toSet()
    }

    @CacheEvict(value = ["tasks", "tasksByDate"], allEntries = true)
    fun createTask(task: Task): Task =
        taskRepository.save(
            applyEdgeParams(task).apply { weight = calculateTaskWeight(this) }.toTaskDto()
        ).toTask()

    private fun applyEdgeParams(task: Task): Task =
        task.apply {
            importance = importance.coerceIn(1, 10)
            urgency = urgency.coerceIn(1, 10)
            personalInterest = personalInterest.coerceIn(1, 10)
            executionTime = executionTime.coerceIn(1, 10)
            complexity = complexity.coerceIn(1, 10)
            concentration = concentration.coerceIn(1, 10)
        }


    @CacheEvict(value = ["tasks", "tasksByDate"], allEntries = true)
    fun createQuickTask(title: String): Task {
        val task = Task(
            id = null,
            title = title,
            description = null,
            date = LocalDate.now(ZoneId.of("Europe/Moscow")),
            tags = emptySet(),
            importance = 10,
            urgency = 10,
            personalInterest = 10,
            executionTime = 10,
            complexity = 10,
            concentration = 10,
            blocked = false,
            completed = false,
            weight = 0.0
        )
        task.weight = calculateTaskWeight(task)
        return taskRepository.save(task.toTaskDto()).toTask()
    }

    fun createQuickLlmTask(title: String): Task? {
        val tasksContext = getTasksByDate(mskLocalDate())
        return llmService.createTask(title, tasksContext)?.let {
            createTask(it)
        }
    }

    @CacheEvict(value = ["tasks", "tasksByDate"], allEntries = true)
    fun updateTask(updatedTask: Task): Task {
        val existingTask = getTaskById(updatedTask.id!!)

        existingTask.apply {
            title = updatedTask.title
            description = updatedTask.description
            date = updatedTask.date
            importance = updatedTask.importance.coerceIn(1, 10)
            urgency = updatedTask.urgency.coerceIn(1, 10)
            personalInterest = updatedTask.personalInterest.coerceIn(1, 10)
            executionTime = updatedTask.executionTime.coerceIn(1, 10)
            complexity = updatedTask.complexity.coerceIn(1, 10)
            concentration = updatedTask.concentration.coerceIn(1, 10)
            blocked = updatedTask.blocked
            completed = updatedTask.completed
            weight = calculateTaskWeight(this)
        }

        return taskRepository.save(existingTask.toTaskDto()).toTask()
    }

    @CacheEvict(value = ["tasks", "tasksByDate"], allEntries = true)
    fun deleteTask(id: Long) {
        if (!taskRepository.existsById(id)) {
            throw NoSuchElementException("Task not found with id: $id")
        }
        taskRepository.deleteById(id)
    }

    @Scheduled(cron = "0 0 0 * * *", zone = "Europe/Moscow")
    @CacheEvict(value = ["tasks", "tasksByDate"], allEntries = true)
    fun postponeOpenTasksToNextDay() {
        logger.info("Move open tasks to next day")
        val openTasks = taskRepository.findByCompletedAndDateBefore(false, mskLocalDate())
        openTasks.forEach { task ->
            val oldDate = task.date
            task.date = mskLocalDate()
            val note = "[Перенесено с ${oldDate}]"
            task.description = (task.description?.let { "$it\n$note" } ?: note)
            logger.info("${task.id} ${task.title} перенесена с ${oldDate}")
            taskRepository.save(task)
        }
    }


    private fun calculateTaskWeight(task: Task): Double =
        (task.importance * 2.6 + task.urgency * 2.1 + task.personalInterest * 1.6 +
                task.executionTime * 1.6 + task.complexity * 1.1 + task.concentration * 1.0) / 10.0

    private fun sortTasks(tasks: List<Task>, sortBy: String, sortOrder: String): List<Task> {
        val isAscending = sortOrder.lowercase() == "asc"
        
        return when (sortBy) {
            "weight" -> {
                tasks.sortedWith { a, b ->
                    if (a.completed != b.completed) {
                        return@sortedWith if (a.completed) 1 else -1
                    }
                    val weightComparison = b.weight.compareTo(a.weight)
                    if (isAscending) -weightComparison else weightComparison
                }
            }
            "importance" -> {
                tasks.sortedWith { a, b ->
                    val importanceComparison = a.importance.compareTo(b.importance)
                    val blockedComparison = a.blocked.compareTo(b.blocked)
                    val result = if (importanceComparison != 0) importanceComparison else blockedComparison
                    if (isAscending) result else -result
                }
            }
            "urgency" -> {
                tasks.sortedWith { a, b ->
                    val urgencyComparison = a.urgency.compareTo(b.urgency)
                    val blockedComparison = a.blocked.compareTo(b.blocked)
                    val result = if (urgencyComparison != 0) urgencyComparison else blockedComparison
                    if (isAscending) result else -result
                }
            }
            "personalInterest" -> {
                tasks.sortedWith { a, b ->
                    val personalInterestComparison = a.personalInterest.compareTo(b.personalInterest)
                    val blockedComparison = a.blocked.compareTo(b.blocked)
                    val result = if (personalInterestComparison != 0) personalInterestComparison else blockedComparison
                    if (isAscending) result else -result
                }
            }
            "executionTime" -> {
                tasks.sortedWith { a, b ->
                    val executionTimeComparison = a.executionTime.compareTo(b.executionTime)
                    val blockedComparison = a.blocked.compareTo(b.blocked)
                    val result = if (executionTimeComparison != 0) executionTimeComparison else blockedComparison
                    if (isAscending) result else -result
                }
            }
            "complexity" -> {
                tasks.sortedWith { a, b ->
                    val complexityComparison = a.complexity.compareTo(b.complexity)
                    val blockedComparison = a.blocked.compareTo(b.blocked)
                    val result = if (complexityComparison != 0) complexityComparison else blockedComparison
                    if (isAscending) result else -result
                }
            }
            "concentration" -> {
                tasks.sortedWith { a, b ->
                    val concentrationComparison = a.concentration.compareTo(b.concentration)
                    val blockedComparison = a.blocked.compareTo(b.blocked)
                    val result = if (concentrationComparison != 0) concentrationComparison else blockedComparison
                    if (isAscending) result else -result
                }
            }
            else -> tasks // Default to original order if unknown sortBy
        }
    }

    companion object : WithLogging()
}