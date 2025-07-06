package com.priority.tasktracker.llm.yandex.domain

import com.fasterxml.jackson.databind.ObjectMapper
import com.priority.tasktracker.llm.yandex.domain.model.request.YaBody
import com.priority.tasktracker.llm.yandex.domain.model.response.YaResponse
import com.priority.tasktracker.llm.yandex.domain.model.response.YaResult
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.time.LocalDateTime

@Service
class YaClient(
    @Value("\${ya.host}") val requestHost: String,
    @Value("\${ya.auth-host}") val authHost: String,
    @Value("\${ya.folder-id}") val folderId: String,
    @Value("\${ya.iam-token}") val iamToken: String,
) {

    private val objectMapper: ObjectMapper = ObjectMapper()
    private val client: RestTemplate = RestTemplate()
    private var yaIamToken: Pair<String, LocalDateTime>? = null

    private fun getToken(): String {
        return if (yaIamToken == null || yaIamToken?.second?.isBefore(LocalDateTime.now()) == true) {
            val response = client.postForEntity(
                authHost,
                HttpEntity(
                    objectMapper.writeValueAsString(TokenRequest(iamToken))
                ),
                TokenResponse::class.java
            ).body!!
            yaIamToken = Pair(response.iamToken, response.expiresAt)
            response.iamToken
        } else {
            (yaIamToken as Pair<String, LocalDateTime>).first
        }
    }

    fun call(body: YaBody): YaResult {
        val token = getToken()
        return client.postForEntity(
            requestHost,
            HttpEntity(
                objectMapper.writeValueAsString(body),
                HttpHeaders().apply {
                    contentType = MediaType.APPLICATION_JSON
                    set("Authorization", "Bearer $token")
                    set("x-folder-id", folderId)
                }
            ),
            YaResponse::class.java
        ).body!!.result!!
    }
}

data class TokenRequest(val yandexPassportOauthToken: String)

data class TokenResponse(
    val iamToken: String,
    val expiresAt: LocalDateTime
)