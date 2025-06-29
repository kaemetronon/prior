package com.priority.tasktracker.controller

import com.priority.tasktracker.service.JwtService
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/token")
class TokenController(
    private val jwtService: JwtService,
    @Value("\${app.pwd}")
    private val appPwd: String
) {

    @PostMapping("/generate")
    fun generateToken(@RequestBody pwd: String): ResponseEntity<Map<String, String>> {
        if (appPwd != pwd) {
            return ResponseEntity.internalServerError().build()
        }
        val token = jwtService.generateToken()
        return ResponseEntity.ok(mapOf("token" to token))
    }
} 