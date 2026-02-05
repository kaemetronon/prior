package com.priority.tasktracker.task.data

import jakarta.persistence.*

@Entity
@Table(name = "tags")
class TagDto(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(unique = true, nullable = false)
    var name: String,

    @ManyToMany(mappedBy = "tags")
    var tasks: MutableSet<TaskDto> = mutableSetOf()
) {
    // Important: stable equality for Hibernate collections (do NOT include tasks in equals/hashCode)
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is TagDto) return false
        return id != null && id == other.id
    }

    override fun hashCode(): Int = id?.hashCode() ?: System.identityHashCode(this)
}
