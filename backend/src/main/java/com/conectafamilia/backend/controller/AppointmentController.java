package com.conectafamilia.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conectafamilia.backend.model.dto.AppointmentRequest;
import com.conectafamilia.backend.model.dto.AppointmentResponse;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.service.AppointmentService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/citas")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAll(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsForUser(user).stream()
                .map(AppointmentResponse::from)
                .toList();
        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(AppointmentResponse.from(appointmentService.bookAppointmentForUser(
                user.getEmail(),
                request.getSpecialistId(),
                request.getAppointmentDate(),
                request.getNotes())));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody java.util.Map<String, String> body,
            Authentication authentication) {
        String status = body.get("status");
        return ResponseEntity.ok(AppointmentResponse.from(
                appointmentService.updateStatusForUser(id, status, getAuthenticatedUser(authentication))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        appointmentService.deleteForUser(id, getAuthenticatedUser(authentication));
        return ResponseEntity.ok().build();
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debe iniciar sesión para agendar una cita");
    }
}
