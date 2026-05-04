package com.conectafamilia.backend.model.entity;

import com.conectafamilia.backend.model.dto.QuestionResponseDTO;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "diagnostic_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosticResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @ElementCollection
    @CollectionTable(name = "diagnostic_result_responses", joinColumns = @JoinColumn(name = "diagnostic_result_id"))
    @OrderColumn(name = "response_order")
    @Builder.Default
    private List<QuestionResponseDTO> responses = new ArrayList<>();

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Column(nullable = false, length = 80)
    private String profile;

    @ElementCollection
    @CollectionTable(name = "diagnostic_result_recommendations", joinColumns = @JoinColumn(name = "diagnostic_result_id"))
    @Column(name = "recommendation", columnDefinition = "TEXT")
    @OrderColumn(name = "recommendation_order")
    @Builder.Default
    private List<String> recommendationsSeen = new ArrayList<>();
}
