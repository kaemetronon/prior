package com.priority.tasktracker.auth.web

import com.priority.tasktracker.auth.domain.JwtService
import com.priority.tasktracker.utils.WithLogging
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtFilter(
    private val jwtService: JwtService,
    @Value("\${app.cors.allowed-origins}")
    private val allowedOrigins: String,
    @Value("\${app.api-token}")
    private val apiToken: String
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        if (request.method == "OPTIONS") {
            filterChain.doFilter(request, response)
            return
        }

        if (request.requestURI == "/api/token/generate") {
            filterChain.doFilter(request, response)
            return
        }

        val authHeader = request.getHeader("Authorization")
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            setCorsHeaders(response)
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header")
            return
        }

        runCatching {
            val token = authHeader.substring(7)
            if (token == apiToken) {
                filterChain.doFilter(request, response)
                return
            }

            if (jwtService.isTokenValid(token)) {
                filterChain.doFilter(request, response)
            } else {
                setCorsHeaders(response)
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token")
                    .also { logger.error("Invalid token: [$token]") }
            }
        }
    }

    fun setCorsHeaders(resp: HttpServletResponse) {
        resp.setHeader("Access-Control-Allow-Origin", allowedOrigins)
        resp.setHeader("Access-Control-Allow-Credentials", "true")
        resp.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With")
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
    }

    companion object : WithLogging()
}