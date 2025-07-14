package com.priority.tasktracker.task.data

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "tasks")
data class TaskDto(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, length = 256)
    var title: String,

    @Column(length = 256)
    var description: String? = null,

    @Column(nullable = false)
    var date: LocalDate,

    @ManyToMany
    @JoinTable(
        name = "task_tags",
        joinColumns = [JoinColumn(name = "task_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    val tags: MutableSet<TagDto> = mutableSetOf(),

    @Column(nullable = false)
    var importance: Int = 5,

    @Column(nullable = false)
    var urgency: Int = 5,

    @Column(name = "personal_interest", nullable = false)
    var personalInterest: Int = 5,

    @Column(name = "execution_time", nullable = false)
    var executionTime: Int = 5,

    @Column(nullable = false)
    var complexity: Int = 5,

    @Column(nullable = false)
    var concentration: Int = 5,

    @Column(nullable = false)
    var blocked: Boolean = false,

    @Column(nullable = false)
    var completed: Boolean = false
)

enum class TaskStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED
}

enum class TaskPriority {
    LOW,
    MEDIUM,
    HIGH
}