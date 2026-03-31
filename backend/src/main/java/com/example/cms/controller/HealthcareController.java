package com.example.cms.controller;

import com.example.cms.entity.Appointment;
import com.example.cms.entity.Notification.NotificationType;
import com.example.cms.entity.Patient;
import com.example.cms.entity.User;
import com.example.cms.entity.HealthRecord;
import com.example.cms.entity.UserVitals;
import com.example.cms.repository.AppointmentRepository;
import com.example.cms.repository.HealthRecordRepository;
import com.example.cms.repository.InsuranceClaimRepository;
import com.example.cms.repository.PatientRepository;
import com.example.cms.repository.UserRepository;
import com.example.cms.repository.UserVitalsRepository;
import com.example.cms.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/sectors/healthcare")
@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('USER') or hasRole('healthcare')")
public class HealthcareController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private UserVitalsRepository userVitalsRepository;

    @Autowired
    private InsuranceClaimRepository insuranceClaimRepository;

    @Autowired
    private NotificationService notificationService;

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
        
        UserVitals vitals = userVitalsRepository.findByUser(user).orElse(new UserVitals(user, "--/--", "-- bpm", "-- kg", "--°F"));
        Map<String, String> vitalsMap = new HashMap<>();
        vitalsMap.put("heartRate", vitals.getHeartRate());
        vitalsMap.put("bloodPressure", vitals.getBloodPressure());
        vitalsMap.put("temperature", vitals.getTemperature());
        vitalsMap.put("weight", vitals.getWeight());
        vitalsMap.put("lastUpdated", vitals.getLastUpdated().toString());
        
        // Frontend uses latestVitals instead of vitals
        stats.put("latestVitals", vitalsMap);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<Page<Appointment>> getMyAppointments(
            @PageableDefault(size = 20, page = 0) Pageable pageable) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(appointmentRepository.findByUser(user, pageable));
    }

    @GetMapping("/my-records")
    public ResponseEntity<List<HealthRecord>> getMyHealthRecords() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(healthRecordRepository.findByUserOrderByRecordDateDesc(user));
    }

    /** User: their own insurance claims (by user FK, with name-based fallback) */
    @GetMapping("/insurance/my-claims")
    public ResponseEntity<List<com.example.cms.entity.InsuranceClaim>> getMyInsuranceClaims() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        // Primary: claims explicitly linked to this user account
        List<com.example.cms.entity.InsuranceClaim> claims =
                insuranceClaimRepository.findByUserOrderBySubmittedAtDesc(user);

        // Fallback: legacy rows seeded with only patientName (no user FK)
        if (claims.isEmpty()) {
            claims = insuranceClaimRepository
                    .findByPatientNameIgnoreCaseOrderBySubmittedAtDesc(user.getUsername());
        }

        return ResponseEntity.ok(claims);
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

    // ─── Smart Scheduling: Get Available Slots ────────────────────────────────
    @GetMapping("/doctors/{doctorName}/availability")
    public ResponseEntity<List<String>> getDoctorAvailability(
            @PathVariable String doctorName,
            @RequestParam String date) { // YYYY-MM-DD
        
        LocalDate targetDate = LocalDate.parse(date);
        LocalDateTime startOfDay = targetDate.atStartOfDay();
        LocalDateTime endOfDay = targetDate.atTime(LocalTime.MAX);

        // Fetch all non-cancelled appointments for this doctor on this day
        List<Appointment> bookedAppointments = appointmentRepository.findDoctorAppointmentsInWindow(
                doctorName, startOfDay, endOfDay);

        // Define standard clinic hours: 09:00 to 17:00, 30-min slots
        List<String> allSlots = new ArrayList<>();
        LocalTime time = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(17, 0);
        while (time.isBefore(endTime)) {
            allSlots.add(time.toString());
            time = time.plusMinutes(30);
        }

        // Remove booked slots
        List<String> bookedTimes = bookedAppointments.stream()
                .map(appt -> appt.getAppointmentTime().toLocalTime().toString())
                .collect(Collectors.toList());

        allSlots.removeAll(bookedTimes);

        return ResponseEntity.ok(allSlots);
    }

    // ─── Smart Scheduling: Conflict Detection on Create ───────────────────────
    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        User currentUser = getCurrentUser();
        
        // Conflict Check: 30-minute window for the same doctor
        if (appointment.getDoctorName() != null && appointment.getAppointmentTime() != null) {
            LocalDateTime slotStart = appointment.getAppointmentTime();
            LocalDateTime slotEnd = slotStart.plusMinutes(30);
            
            List<Appointment> conflicts = appointmentRepository.findDoctorAppointmentsInWindow(
                    appointment.getDoctorName(), slotStart, slotEnd);
            
            if (!conflicts.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("success", false, "message", "The selected time slot is already booked for this doctor."));
            }
        }

        if (currentUser != null) {
            appointment.setUser(currentUser);
            // If patient name not provided by user, use their email/username
            if (appointment.getPatientName() == null || appointment.getPatientName().isEmpty()) {
                appointment.setPatientName(currentUser.getUsername());
            }
        }

        if (appointment.getAppointmentId() == null || appointment.getAppointmentId().isEmpty()) {
            appointment.setAppointmentId("APT-" + System.currentTimeMillis());
        }

        if (appointment.getDoctorName() == null || appointment.getDoctorName().isEmpty()) {
            appointment.setDoctorName("To be assigned");
        }

        if (appointment.getStatus() == null) {
            appointment.setStatus(Appointment.AppointmentStatus.PENDING);
        }

        Appointment savedAppointment = appointmentRepository.save(appointment);
        // Notify user about the new appointment
        if (currentUser != null) {
            notificationService.createAndSend(
                currentUser.getId(), currentUser.getUsername(),
                NotificationType.APPOINTMENT,
                "Appointment Booked",
                "Your appointment with " + savedAppointment.getDoctorName() + " is pending confirmation.",
                "/user/healthcare/appointments"
            );
        }
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
                    Appointment savedAppt = appointmentRepository.save(appointment);
                    // Notify patient when appointment is confirmed
                    if (appointmentDetails.getStatus() == Appointment.AppointmentStatus.CONFIRMED
                            && appointment.getUser() != null) {
                        notificationService.createAndSend(
                            appointment.getUser().getId(), appointment.getUser().getUsername(),
                            NotificationType.APPOINTMENT,
                            "Appointment Confirmed",
                            "Your appointment with " + savedAppt.getDoctorName() + " has been confirmed.",
                            "/user/healthcare/appointments"
                        );
                    }
                    return ResponseEntity.ok(savedAppt);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Today's date range
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        
        // Patient statistics
        Long totalPatients = patientRepository.countTotalPatients();
        Long activeCases = patientRepository.countActiveCases();
        Long criticalPatients = patientRepository.countCriticalPatients();
        Long todaysVisits = patientRepository.countTodaysVisits();
        
        // Appointment statistics
        Long todaysAppointments = appointmentRepository.countTodaysAppointments(startOfDay, endOfDay);
        Long confirmedAppointments = appointmentRepository.countTodaysConfirmedAppointments(startOfDay, endOfDay);
        Long urgentAppointments = appointmentRepository.countTodaysUrgentAppointments(startOfDay, endOfDay);
        Long allPendingAppointments = appointmentRepository.countAllPendingAppointments();
        
        stats.put("totalPatients", totalPatients != null ? totalPatients : 0);
        stats.put("activeCases", activeCases != null ? activeCases : 0);
        stats.put("criticalPatients", criticalPatients != null ? criticalPatients : 0);
        stats.put("todaysVisits", todaysVisits != null ? todaysVisits : 0);
        stats.put("todaysAppointments", todaysAppointments != null ? todaysAppointments : 0);
        stats.put("confirmedAppointments", confirmedAppointments != null ? confirmedAppointments : 0);
        stats.put("pendingAppointments", allPendingAppointments != null ? allPendingAppointments : 0);
        stats.put("urgentAppointments", urgentAppointments != null ? urgentAppointments : 0);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/activity/recent")
    public ResponseEntity<List<Appointment>> getRecentActivity() {
        return ResponseEntity.ok(appointmentRepository.findTop5ByOrderByCreatedAtDesc());
    }

    // Insurance Management Endpoints
    @GetMapping("/insurance/claims")
    public ResponseEntity<Map<String, Object>> getInsuranceClaims() {
        Map<String, Object> claimsData = new HashMap<>();
        
        Double approved = insuranceClaimRepository.sumApprovedClaims();
        Double pending = insuranceClaimRepository.sumPendingClaims();
        Double denied = insuranceClaimRepository.sumDeniedClaims();
        
        approved = approved != null ? approved : 0.0;
        pending = pending != null ? pending : 0.0;
        denied = denied != null ? denied : 0.0;
        
        double total = approved + pending + denied;
        double successRate = total > 0 ? (approved / total) * 100.0 : 0.0;
        
        claimsData.put("approvedClaims", approved);
        claimsData.put("pendingClaims", pending);
        claimsData.put("deniedClaims", denied);
        claimsData.put("successRate", Math.round(successRate * 10.0) / 10.0);
        
        return ResponseEntity.ok(claimsData);
    }

    // Admin - all insurance claims (full detail list)
    @GetMapping("/insurance/claims/all")
    public ResponseEntity<List<com.example.cms.entity.InsuranceClaim>> getAllInsuranceClaims() {
        return ResponseEntity.ok(insuranceClaimRepository.findAll());
    }

    // Admin - all health records across all users
    @GetMapping("/records/all")
    public ResponseEntity<List<HealthRecord>> getAllHealthRecords() {
        return ResponseEntity.ok(healthRecordRepository.findAllWithUser());
    }

    // Medical History Endpoints
    @GetMapping("/patients/{patientId}/history")
    public ResponseEntity<Map<String, Object>> getPatientHistory(@PathVariable String patientId) {
        Map<String, Object> historyData = new HashMap<>();
        
        Patient patient = patientRepository.findById(Long.parseLong(patientId)).orElse(null);
        if (patient == null) {
            return ResponseEntity.notFound().build();
        }
        
        String fullName = patient.getFirstName() + " " + patient.getLastName();
        long totalVisits = appointmentRepository.countByPatientName(fullName);
        
        // Use deterministic simple logic for missing data until tables expand.
        historyData.put("totalVisits", totalVisits);
        historyData.put("activeMedications", (patient.getId() % 3) + 1); // Mocked deterministic value based on ID
        historyData.put("knownAllergies", (patient.getId() % 2));
        historyData.put("labResults", totalVisits > 0 ? totalVisits * 2 : 1);
        
        return ResponseEntity.ok(historyData);
    }
}