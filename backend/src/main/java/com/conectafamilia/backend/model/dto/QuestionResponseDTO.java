package com.conectafamilia.backend.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseDTO {
    
    @Column(name = "question_id")
    @NotNull(message = "El ID de la pregunta no puede ser nulo")
    @Min(value = 1, message = "El ID de la pregunta debe ser al menos 1")
    @Max(value = 10, message = "El ID de la pregunta no puede ser mayor a 10")
    private Integer questionId;

    @Column(name = "score")
    @NotNull(message = "El puntaje no puede ser nulo")
    private Integer score;
}
