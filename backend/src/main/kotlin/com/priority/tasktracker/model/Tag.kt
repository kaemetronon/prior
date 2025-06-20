package com.priority.tasktracker.model

import jakarta.persistence.*

@Entity
@Table(name = "tags")
data class Tag(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false)
    var name: String,

    @ManyToMany(mappedBy = "tags")
    val tasks: MutableSet<Task> = mutableSetOf()
) 