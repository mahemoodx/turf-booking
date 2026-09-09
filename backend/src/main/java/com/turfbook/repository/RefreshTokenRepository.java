package com.turfbook.repository;

import com.turfbook.entity.RefreshToken;
import java.util.*;
import org.springframework.data.jpa.repository.*;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
  Optional<RefreshToken> findByTokenId(String tokenId);
  @Modifying @Query("update RefreshToken r set r.revoked = true where r.user.id = :userId and r.revoked = false")
  void revokeActiveTokens(UUID userId);
  void deleteByExpiresAtBefore(java.time.Instant instant);
}
