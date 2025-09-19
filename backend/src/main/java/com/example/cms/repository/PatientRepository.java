package com.example.cms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.cms.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Optional<Patient> findByPatientId(String patientId);
    
    List<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    
    List<Patient> findByConditionContainingIgnoreCase(String condition);
    
    List<Patient> findByStatus(Patient.PatientStatus status);
    
    @Query("SELECT COUNT(p) FROM Patient p")
    Long countTotalPatients();
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.status IN ('STABLE', 'MONITORING')")
    Long countActiveCases();
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.status = 'CRITICAL'")
    Long countCriticalPatients();
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.lastVisit = CURRENT_DATE")
    Long countTodaysVisits();
}