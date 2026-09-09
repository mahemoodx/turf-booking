package com.turfbook.repository;

import com.turfbook.entity.Turf;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TurfRepository extends JpaRepository<Turf, UUID>, JpaSpecificationExecutor<Turf> {
  @EntityGraph(attributePaths = {"city", "facilities", "sports", "imageUrls"})
  @Query("select t from Turf t where t.id = :id")
  Optional<Turf> findWithRelationsById(UUID id);
  @Query("select distinct t.area from Turf t where t.city.id = :cityId and t.active = true order by t.area")
  List<String> findDistinctAreasByCityId(UUID cityId);
  long countByActiveTrue();
}
