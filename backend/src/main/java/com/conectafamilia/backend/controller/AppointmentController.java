package com.conectafamilia.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conectafamilia.backend.model.entity.Appointment;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.service.AppointmentService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/citas")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(appointmentService.getAll());
    }

    @PostMapping
    public ResponseEntity<Appointment> create(@jakarta.validation.Valid @RequestBody Appointment appointment, Authentication authentication) {
        Long userId = 1L;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            Long authenticatedUserId = ((User) authentication.getPrincipal()).getId();
            if (authenticatedUserId != null) {
                userId = authenticatedUserId;
            }
        }
        Long specialistId = 2L;
        if (appointment.getSpecialist() != null && appointment.getSpecialist().getId() != null) {
            specialistId = appointment.getSpecialist().getId();
        }
        LocalDateTime appointmentDate = appointment.getAppointmentDate() != null ? appointment.getAppointmentDate() : LocalDateTime.now();
        return ResponseEntity.ok(appointmentService.bookAppointment(
                userId,
                specialistId,
                appointmentDate,
                appointment.getNotes()
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @jakarta.validation.Valid @RequestBody java.util.Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        appointmentService.delete(id);
        return ResponseEntity.ok().build();
    }
}
