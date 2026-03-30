package com.example.cms.repository;

import com.example.cms.entity.Appointment;
import com.example.cms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByUser(User user);
    
    Page<Appointment> findByUser(User user, Pageable pageable);

    Optional<Appointment> findByAppointmentId(String appointmentId);
    
    List<Appointment> findByPatientNameContainingIgnoreCase(String patientName);
    
    List<Appointment> findByDoctorName(String doctorName);
    
    // Smart Scheduling
    @Query("SELECT a FROM Appointment a WHERE a.doctorName = :doctorName AND a.status != 'CANCELLED' " +
           "AND a.appointmentTime >= :start AND a.appointmentTime < :end")
    List<Appointment> findDoctorAppointmentsInWindow(
        @Param("doctorName") String doctorName,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
    
    List<Appointment> findByType(Appointment.AppointmentType type);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentTime BETWEEN :startDate AND :endDate")
    List<Appointment> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentTime >= :start AND a.appointmentTime < :end")
    Long countTodaysAppointments(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = com.example.cms.entity.Appointment.AppointmentStatus.CONFIRMED AND a.appointmentTime >= :start AND a.appointmentTime < :end")
    Long countTodaysConfirmedAppointments(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = com.example.cms.entity.Appointment.AppointmentStatus.PENDING AND a.appointmentTime >= :start AND a.appointmentTime < :end")
    Long countTodaysPendingAppointments(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = com.example.cms.entity.Appointment.AppointmentStatus.URGENT AND a.appointmentTime >= :start AND a.appointmentTime < :end")
    Long countTodaysUrgentAppointments(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    List<Appointment> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = com.example.cms.entity.Appointment.AppointmentStatus.PENDING")
    Long countAllPendingAppointments();
    // Calculate total visits for a specific patient
    long countByPatientName(String patientName);

    // Get appointments by patient name
    List<Appointment> findByPatientName(String patientName);
}