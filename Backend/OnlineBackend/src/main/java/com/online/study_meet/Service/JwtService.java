package com.online.study_meet.Service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value(value = "${security.jwt.secret-key}")
    private String SECRET_KEY;

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))//1 hour
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

        private Claims extractAllClaims(String token){
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }
        public <T> T extractClaim(String token, Function<Claims,T> claimsResolver){
            final Claims claims=extractAllClaims(token);
            return claimsResolver.apply(claims);
        }
        public String extractUsername(String token){
            return extractClaim(token,Claims::getSubject);
        }

        public boolean isValid(String token, UserDetails userDetails) {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())&& !isTokenExpired(token));
        }

        private boolean isTokenExpired(String token) {
            return extractExpiration(token).before(new Date());
        }

        private Date extractExpiration(String token) {
            return extractClaim(token,Claims::getExpiration);
        }
}