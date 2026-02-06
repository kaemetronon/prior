package com.priority.tasktracker.task.data

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "tasks")
class TaskDto(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, length = 256)
    var title: String,

    @Column
    var description: String? = null,

    @Column(nullable = false)
    var date: LocalDate,

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "task_tags",
        joinColumns = [JoinColumn(name = "task_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    var tags: MutableSet<TagDto> = mutableSetOf(),

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
    var completed: Boolean = false,

    @Column(nullable = false)
    var weight: Double = 0.0
) {
    // Important: stable equality for Hibernate collections (do NOT include tags in equals/hashCode)
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is TaskDto) return false
        return id != null && id == other.id
    }

    override fun hashCode(): Int = id?.hashCode() ?: System.identityHashCode(this)
}

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
