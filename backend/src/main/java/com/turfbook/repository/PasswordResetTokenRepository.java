package com.turfbook.repository;

import com.turfbook.entity.PasswordResetToken;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
  Optional<PasswordResetToken> findByTokenHash(String tokenHash);
}
