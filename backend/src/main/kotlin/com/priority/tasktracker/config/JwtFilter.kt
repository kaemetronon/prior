package com.priority.tasktracker.config

import com.priority.tasktracker.service.JwtService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtFilter(
    private val jwtService: JwtService
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
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header")
            return
        }

        runCatching {
            val jwt = authHeader.substring(7)
            if (jwtService.isTokenValid(jwt)) {
                filterChain.doFilter(request, response)
            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token")
                    .also { logger.error("Invalid token: [$jwt]") }
            }
        }
        try {

        } catch (ex: Exception) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token validation failed")
                .also { logger.error("Token validation failed:  ${ex.message}") }
        }
    }

    companion object : WithLogging()
}