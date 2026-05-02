package com.conectafamilia.backend.model.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosticSubmissionDTO {

    @NotNull(message = "El ID del usuario es requerido")
    private Long userId;

    @NotNull(message = "Las respuestas son requeridas")
    @Size(min = 10, max = 10, message = "Debe enviar exactamente 10 respuestas")
    @Valid
    private List<QuestionResponseDTO> responses;
}
