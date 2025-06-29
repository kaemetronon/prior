package com.priority.tasktracker.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.Key
import java.util.*

@Service
class JwtService(
    @Value("\${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private val secretKey: String,
    @Value("\${jwt.expiration:86400000}")
    private val jwtExpiration: Long
) {
    fun generateToken(): String =
        Jwts
            .builder()
            .subject("user")
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSignInKey())
            .compact()

    fun isTokenValid(token: String): Boolean =
        runCatching {
            !isTokenExpired(extractAllClaims(token))
        }.getOrNull() != null

    private fun isTokenExpired(claims: Claims): Boolean {
        return claims.expiration.before(Date())
    }

    private fun extractAllClaims(token: String): Claims {
        return Jwts
            .parser()
            .setSigningKey(getSignInKey())
            .build()
            .parseSignedClaims(token)
            .payload
    }

    private fun getSignInKey(): Key {
        val keyBytes = Decoders.BASE64.decode(secretKey)
        return Keys.hmacShaKeyFor(keyBytes)
    }
} 