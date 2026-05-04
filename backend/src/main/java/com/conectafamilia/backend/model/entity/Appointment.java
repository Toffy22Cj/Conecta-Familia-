package com.conectafamilia.backend.model.entity;

import com.conectafamilia.backend.model.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @jakarta.validation.constraints.NotNull(message = "El usuario es obligatorio")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialist_id", nullable = false)
    @jakarta.validation.constraints.NotNull(message = "El especialista es obligatorio")
    private User specialist;

    @Column(name = "appointment_date", nullable = false)
    @jakarta.validation.constraints.NotNull(message = "La fecha es obligatoria")
    @jakarta.validation.constraints.Future(message = "La fecha debe ser en el futuro")
    private LocalDateTime appointmentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @jakarta.validation.constraints.NotNull(message = "El estado es obligatorio")
    private AppointmentStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
