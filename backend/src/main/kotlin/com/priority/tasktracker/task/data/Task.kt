package com.priority.tasktracker.task.data

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "tasks")
data class Task(
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
    val tags: MutableSet<Tag> = mutableSetOf(),

    @Column(nullable = false)
    var urgency: Int = 3,

    @Column(name = "personal_interest", nullable = false)
    var personalInterest: Int = 3,

    @Column(name = "execution_time", nullable = false)
    var executionTime: Int = 3,

    @Column(nullable = false)
    var complexity: Int = 3,

    @Column(nullable = false)
    var concentration: Int = 3,

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