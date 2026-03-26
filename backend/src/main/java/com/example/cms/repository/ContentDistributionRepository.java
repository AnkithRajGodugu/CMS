package com.example.cms.repository;

import com.example.cms.entity.ContentDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentDistributionRepository extends JpaRepository<ContentDistribution, Long> {
}
