package com.example.cms.repository;

import com.example.cms.entity.InsuranceClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {

    @Query("SELECT SUM(c.amount) FROM InsuranceClaim c WHERE c.status = 'APPROVED'")
    Double sumApprovedClaims();

    @Query("SELECT SUM(c.amount) FROM InsuranceClaim c WHERE c.status = 'PENDING'")
    Double sumPendingClaims();

    @Query("SELECT SUM(c.amount) FROM InsuranceClaim c WHERE c.status = 'DENIED'")
    Double sumDeniedClaims();
}
