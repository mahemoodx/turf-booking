package com.turfbook.repository;

import com.turfbook.entity.City;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, UUID> {
  Optional<City> findByNameIgnoreCase(String name);
  List<City> findAllByOrderByNameAsc();
}
