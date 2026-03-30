package com.example.cms.repository;

import com.example.cms.entity.HealthRecord;
import com.example.cms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    @Query("SELECT hr FROM HealthRecord hr JOIN FETCH hr.user ORDER BY hr.recordDate DESC")
    List<HealthRecord> findAllWithUser();

    @Query("SELECT hr FROM HealthRecord hr JOIN FETCH hr.user WHERE hr.user = :user ORDER BY hr.recordDate DESC")
    List<HealthRecord> findByUserOrderByRecordDateDesc(@Param("user") User user);

    Page<HealthRecord> findByUserOrderByRecordDateDesc(User user, Pageable pageable);
}
