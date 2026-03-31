package com.example.cms.repository;

import com.example.cms.entity.InsuranceClaim;
import com.example.cms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {

    @Query("SELECT SUM(c.amount) FROM InsuranceClaim c WHERE c.status = 'APPROVED'")
    Double sumApprovedClaims();

    @Query("SELECT SUM(c.amount) FROM InsuranceClaim c WHERE c.status = 'PENDING'")
    Double sumPendingClaims();

    @Query("SELECT SUM(c.amount) FROM InsuranceClaim c WHERE c.status = 'DENIED'")
    Double sumDeniedClaims();

    /** Fetch all claims linked to a specific user account */
    List<InsuranceClaim> findByUserOrderBySubmittedAtDesc(User user);

    /**
     * Fallback: find by patientName matching the user's username
     * (used for legacy rows that pre-date the user_id column)
     */
    List<InsuranceClaim> findByPatientNameIgnoreCaseOrderBySubmittedAtDesc(String patientName);
}
