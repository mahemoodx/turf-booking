package com.turfbook.repository;

import com.turfbook.entity.ContactInquiry;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, UUID> {}
