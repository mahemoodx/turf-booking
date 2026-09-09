package com.turfbook.repository;

import com.turfbook.entity.EmailVerificationToken;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {
  Optional<EmailVerificationToken> findByTokenHash(String tokenHash);
}
