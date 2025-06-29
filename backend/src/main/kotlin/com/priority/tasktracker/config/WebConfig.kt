package com.priority.tasktracker.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {

    @Value("\${app.cors.allowed-origins}")
    private lateinit var allowedOrigins: String

    @Bean
    fun jwtFilterRegistration(jwtFilter: JwtFilter): FilterRegistrationBean<JwtFilter> {
        val registration = FilterRegistrationBean<JwtFilter>()
        registration.filter = jwtFilter
        registration.addUrlPatterns("/api/*")
        registration.order = Ordered.HIGHEST_PRECEDENCE
        return registration
    }

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins(*allowedOrigins.split(",").map { it.trim() }.toTypedArray())
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
            .allowedHeaders("*")
            .allowCredentials(true)
    }
} 