package com.turfbook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "facilities")
@Getter @Setter @NoArgsConstructor
public class Facility {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @Column(nullable = false, unique = true, length = 100) private String name;
  @Column(length = 100) private String icon;
}
