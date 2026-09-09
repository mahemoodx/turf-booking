package com.turfbook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "cities", uniqueConstraints = @UniqueConstraint(columnNames = {"name", "state"}))
@Getter @Setter @NoArgsConstructor
public class City {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @Column(nullable = false, length = 100) private String name;
  @Column(nullable = false, length = 100) private String state;
  @Column(nullable = false, length = 100) private String country = "India";
  @Column(name = "pincode_prefix", length = 12) private String pincodePrefix;
}
