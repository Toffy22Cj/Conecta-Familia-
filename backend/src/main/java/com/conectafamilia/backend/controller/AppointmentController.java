package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.entity.Appointment;
import com.conectafamilia.backend.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(
            @RequestParam Long userId,
            @RequestParam Long specialistId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date,
            @RequestParam(required = false) String notes) {
        
        return ResponseEntity.ok(appointmentService.bookAppointment(userId, specialistId, date, notes));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getUserAppointments(@PathVariable Long userId) {
        return ResponseEntity.ok(appointmentService.getUserAppointments(userId));
    }

    @GetMapping("/specialist/{specialistId}")
    public ResponseEntity<List<Appointment>> getSpecialistAppointments(@PathVariable Long specialistId) {
        return ResponseEntity.ok(appointmentService.getSpecialistAppointments(specialistId));
    }
}
