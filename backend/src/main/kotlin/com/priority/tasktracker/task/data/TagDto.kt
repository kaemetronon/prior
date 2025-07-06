package com.priority.tasktracker.task.data

import jakarta.persistence.*

@Entity
@Table(name = "tags")
data class TagDto(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false)
    var name: String,

    @ManyToMany(mappedBy = "tags")
    val tasks: MutableSet<TaskDto> = mutableSetOf()
) 