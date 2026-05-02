package com.conectafamilia.backend.model.document;

import com.conectafamilia.backend.model.dto.QuestionResponseDTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "diagnostic_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosticResult {

    @Id
    private String id;

    private Long userId; // Referencia a MariaDB

    private LocalDateTime timestamp;

    private List<QuestionResponseDTO> responses;

    private Integer totalScore;

    private String profile;

    private List<String> recommendationsSeen;
}
