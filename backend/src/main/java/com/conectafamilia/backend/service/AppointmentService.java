package com.conectafamilia.backend.service;

import com.conectafamilia.backend.model.entity.Appointment;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.enums.AppointmentStatus;
import com.conectafamilia.backend.model.enums.Role;
import com.conectafamilia.backend.repository.jpa.AppointmentRepository;
import com.conectafamilia.backend.repository.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public Appointment bookAppointmentForUser(
            String userEmail,
            Long specialistId,
            LocalDateTime date,
            String notes) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        User specialist = findSpecialist(specialistId);

        return createAppointment(user, specialist, date, notes);
    }

    public Appointment bookAppointment(Long userId, Long specialistId, LocalDateTime date, String notes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        User specialist = findSpecialist(specialistId);

        return createAppointment(user, specialist, date, notes);
    }

    private User findSpecialist(Long specialistId) {
        User specialist = userRepository.findById(specialistId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Specialist not found"));
        if (specialist.getRole() != Role.ESPECIALISTA) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The selected user is not a specialist");
        }
        return specialist;
    }

    private Appointment createAppointment(User user, User specialist, LocalDateTime date, String notes) {
        Appointment appointment = Appointment.builder()
                .user(user)
                .specialist(specialist)
                .appointmentDate(date)
                .status(AppointmentStatus.PENDING)
                .notes(notes)
                .build();

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getUserAppointments(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    public List<Appointment> getSpecialistAppointments(Long specialistId) {
        return appointmentRepository.findBySpecialistId(specialistId);
    }

    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    public void delete(Long id) {
        appointmentRepository.deleteById(id);
    }

    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
        if (status == null || status.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required");
        }
        try {
            appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            // Fallback or handle specific statuses from frontend
            if (status.equalsIgnoreCase("completada")) {
                appointment.setStatus(AppointmentStatus.COMPLETED);
            } else {
                appointment.setStatus(AppointmentStatus.PENDING);
            }
        }
        return appointmentRepository.save(appointment);
    }
}
