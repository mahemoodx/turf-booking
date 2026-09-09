package com.turfbook.repository;

import com.turfbook.entity.Review;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
  boolean existsByTurfIdAndUserId(UUID turfId, UUID userId);
  Page<Review> findByTurfIdOrderByCreatedAtDesc(UUID turfId, Pageable pageable);
  @Query("select avg(r.rating) from Review r where r.turf.id = :turfId") Double averageRating(UUID turfId);
  long countByTurfId(UUID turfId);
}
