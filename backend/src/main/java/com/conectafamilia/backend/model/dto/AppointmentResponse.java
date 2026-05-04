package com.conectafamilia.backend.model.dto;

import java.time.LocalDateTime;

import com.conectafamilia.backend.model.entity.Appointment;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.enums.AppointmentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private SimpleUser user;
    private SimpleUser specialist;
    private LocalDateTime appointmentDate;
    private AppointmentStatus status;
    private String notes;

    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                SimpleUser.from(appointment.getUser()),
                SimpleUser.from(appointment.getSpecialist()),
                appointment.getAppointmentDate(),
                appointment.getStatus(),
                appointment.getNotes());
    }

    @Data
    @AllArgsConstructor
    public static class SimpleUser {
        private Long id;
        private String fullName;
        private String email;

        public static SimpleUser from(User user) {
            if (user == null) {
                return null;
            }
            return new SimpleUser(user.getId(), user.getFullName(), user.getEmail());
        }
    }
}
