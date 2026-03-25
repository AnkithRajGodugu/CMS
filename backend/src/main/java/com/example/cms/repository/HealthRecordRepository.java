package com.example.cms.repository;

import com.example.cms.entity.HealthRecord;
import com.example.cms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    List<HealthRecord> findByUserOrderByRecordDateDesc(User user);
    Page<HealthRecord> findByUserOrderByRecordDateDesc(User user, Pageable pageable);
}
