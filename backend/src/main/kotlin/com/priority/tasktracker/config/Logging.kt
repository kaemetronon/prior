package com.priority.tasktracker.config

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.reflect.full.companionObject

fun <T : Any> unwrapCompanionClass(ofClass: Class<T>) = ofClass.enclosingClass?.takeIf {
    it.kotlin.companionObject?.java == ofClass
} ?: ofClass

interface Loggable

private fun Loggable.logger(): Logger = LoggerFactory.getLogger(unwrapCompanionClass(this.javaClass).name)

abstract class WithLogging : Loggable {
    val logger: Logger = logger()
}
