package com.turfbook.repository;

import com.turfbook.entity.Role;
import com.turfbook.enums.RoleName;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, UUID> {
  Optional<Role> findByName(RoleName name);
}
