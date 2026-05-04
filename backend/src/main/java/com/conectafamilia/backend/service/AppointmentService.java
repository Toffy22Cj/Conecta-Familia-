package com.conectafamilia.backend.service;

import com.conectafamilia.backend.model.entity.Appointment;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.enums.AppointmentStatus;
import com.conectafamilia.backend.model.enums.Role;
import com.conectafamilia.backend.repository.jpa.AppointmentRepository;
import com.conectafamilia.backend.repository.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public Appointment bookAppointment(Long userId, Long specialistId, LocalDateTime date, String notes) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User specialist = userRepository.findById(specialistId).orElseThrow(() -> new RuntimeException("Specialist not found"));

        if (specialist.getRole() != Role.ESPECIALISTA) {
            throw new RuntimeException("The selected user is not a specialist");
        }

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
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
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
