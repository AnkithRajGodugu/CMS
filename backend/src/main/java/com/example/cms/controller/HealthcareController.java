package com.example.cms.controller;

import com.example.cms.entity.Patient;
import com.example.cms.entity.Appointment;
import com.example.cms.repository.PatientRepository;
import com.example.cms.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/healthcare")
@PreAuthorize("hasRole('ADMIN') or hasRole('healthcare')")
public class HealthcareController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Patient Management Endpoints
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/patients")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient savedPatient = patientRepository.save(patient);
        return ResponseEntity.ok(savedPatient);
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        return patientRepository.findById(id)
                .map(patient -> {
                    patient.setFirstName(patientDetails.getFirstName());
                    patient.setLastName(patientDetails.getLastName());
                    patient.setAge(patientDetails.getAge());
                    patient.setCondition(patientDetails.getCondition());
                    patient.setStatus(patientDetails.getStatus());
                    patient.setContactNumber(patientDetails.getContactNumber());
                    patient.setEmail(patientDetails.getEmail());
                    patient.setAddress(patientDetails.getAddress());
                    return ResponseEntity.ok(patientRepository.save(patient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patients/search")
    public ResponseEntity<List<Patient>> searchPatients(@RequestParam String query) {
        List<Patient> patients = patientRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
        return ResponseEntity.ok(patients);
    }

    // Appointment Management Endpoints
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return ResponseEntity.ok(savedAppointment);
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setPatientName(appointmentDetails.getPatientName());
                    appointment.setDoctorName(appointmentDetails.getDoctorName());
                    appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
                    appointment.setType(appointmentDetails.getType());
                    appointment.setStatus(appointmentDetails.getStatus());
                    appointment.setNotes(appointmentDetails.getNotes());
                    return ResponseEntity.ok(appointmentRepository.save(appointment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Patient statistics
        Long totalPatients = patientRepository.countTotalPatients();
        Long activeCases = patientRepository.countActiveCases();
        Long criticalPatients = patientRepository.countCriticalPatients();
        Long todaysVisits = patientRepository.countTodaysVisits();
        
        // Appointment statistics
        Long todaysAppointments = appointmentRepository.countTodaysAppointments();
        Long confirmedAppointments = appointmentRepository.countTodaysConfirmedAppointments();
        Long pendingAppointments = appointmentRepository.countTodaysPendingAppointments();
        Long urgentAppointments = appointmentRepository.countTodaysUrgentAppointments();
        
        stats.put("totalPatients", totalPatients != null ? totalPatients : 0);
        stats.put("activeCases", activeCases != null ? activeCases : 0);
        stats.put("criticalPatients", criticalPatients != null ? criticalPatients : 0);
        stats.put("todaysVisits", todaysVisits != null ? todaysVisits : 0);
        stats.put("todaysAppointments", todaysAppointments != null ? todaysAppointments : 0);
        stats.put("confirmedAppointments", confirmedAppointments != null ? confirmedAppointments : 0);
        stats.put("pendingAppointments", pendingAppointments != null ? pendingAppointments : 0);
        stats.put("urgentAppointments", urgentAppointments != null ? urgentAppointments : 0);
        
        return ResponseEntity.ok(stats);
    }

    // Insurance Management Endpoints
    @GetMapping("/insurance/claims")
    public ResponseEntity<Map<String, Object>> getInsuranceClaims() {
        Map<String, Object> claimsData = new HashMap<>();
        
        // Sample insurance data - in real implementation, this would come from database
        claimsData.put("approvedClaims", 45230.00);
        claimsData.put("pendingClaims", 12850.00);
        claimsData.put("deniedClaims", 3450.00);
        claimsData.put("successRate", 87.5);
        
        return ResponseEntity.ok(claimsData);
    }

    // Medical History Endpoints
    @GetMapping("/patients/{patientId}/history")
    public ResponseEntity<Map<String, Object>> getPatientHistory(@PathVariable String patientId) {
        Map<String, Object> historyData = new HashMap<>();
        
        // Sample medical history data
        historyData.put("totalVisits", 4);
        historyData.put("activeMedications", 3);
        historyData.put("knownAllergies", 2);
        historyData.put("labResults", 4);
        
        return ResponseEntity.ok(historyData);
    }
}