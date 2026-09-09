package com.turfbook.repository;

import com.turfbook.entity.Facility;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacilityRepository extends JpaRepository<Facility, UUID> {
  List<Facility> findByNameIn(Collection<String> names);
  List<Facility> findAllByOrderByNameAsc();
}
