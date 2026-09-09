package com.turfbook.config;

import com.turfbook.security.*;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration @EnableWebSecurity @EnableMethodSecurity @RequiredArgsConstructor
public class SecurityConfig {
  private final JwtAuthenticationFilter jwtFilter;
  private final TurfUserDetailsService users;
  @Value("${app.cors.allowed-origins}") private String allowedOrigins;

  @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
  @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception { return config.getAuthenticationManager(); }
  @Bean DaoAuthenticationProvider authenticationProvider(PasswordEncoder encoder) {
    var provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(users);
    provider.setPasswordEncoder(encoder);
    return provider;
  }
  @Bean CorsConfigurationSource corsConfigurationSource() {
    var cors = new CorsConfiguration();
    cors.setAllowedOrigins(List.of(allowedOrigins.split(",")));
    cors.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    cors.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    cors.setExposedHeaders(List.of("Authorization"));
    cors.setAllowCredentials(true);
    var source = new UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/**", cors); return source;
  }
  @Bean SecurityFilterChain filterChain(HttpSecurity http, DaoAuthenticationProvider provider) throws Exception {
    return http.csrf(csrf -> csrf.disable()).cors(cors -> {}).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authenticationProvider(provider)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**", "/swagger-ui/**", "/swagger-ui.html", "/api-docs/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/turfs/**", "/api/cities/**", "/api/sports", "/api/facilities").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
            .anyRequest().authenticated())
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
  }
}
