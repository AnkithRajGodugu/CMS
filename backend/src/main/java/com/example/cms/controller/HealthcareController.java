package com.example.cms.controller;

import com.example.cms.entity.Patient;
import com.example.cms.entity.Appointment;
import com.example.cms.entity.User;
import com.example.cms.repository.PatientRepository;
import com.example.cms.repository.AppointmentRepository;
import com.example.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/sectors/healthcare")
@PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('healthcare')")
public class HealthcareController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof com.example.cms.security.CustomUserDetails customUserDetails) {
            return customUserDetails.getUser();
        }

        return null;
    }

    @GetMapping("/my-dashboard")
    public ResponseEntity<Map<String, Object>> getMyDashboard() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Map<String, Object> stats = new HashMap<>();
        List<Appointment> appointments = appointmentRepository.findByUser(user);
        
        stats.put("totalAppointments", appointments.size());
        stats.put("confirmedAppointments", appointments.stream().filter(a -> a.getStatus() == Appointment.AppointmentStatus.CONFIRMED).count());
        stats.put("pendingAppointments", appointments.stream().filter(a -> a.getStatus() == Appointment.AppointmentStatus.PENDING).count());
        
        // Sample vitals for the dashboard (since we don't have a Vitals entity yet, we'll return some static real-looking data linked to user)
        stats.put("vitals", Map.of(
            "heartRate", "72 bpm",
            "bloodPressure", "120/80",
            "temperature", "98.6°F",
            "weight", "70 kg"
        ));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<Page<Appointment>> getMyAppointments(
            @PageableDefault(size = 20, page = 0) Pageable pageable) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(appointmentRepository.findByUser(user, pageable));
    }

    // Patient Management Endpoints
    @GetMapping("/patients")
    public ResponseEntity<Page<Patient>> getAllPatients(
            @PageableDefault(size = 20, page = 0) Pageable pageable) {
        Page<Patient> patients = patientRepository.findAll(pageable);
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
    public ResponseEntity<Page<Appointment>> getAllAppointments(
            @PageableDefault(size = 20, page = 0) Pageable pageable) {
        Page<Appointment> appointments = appointmentRepository.findAll(pageable);
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