package com.turfbook.entity;

import com.turfbook.enums.RoleName;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Role {
  @Id @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;
  @Enumerated(EnumType.STRING) @Column(nullable = false, unique = true, length = 30)
  private RoleName name;
}
