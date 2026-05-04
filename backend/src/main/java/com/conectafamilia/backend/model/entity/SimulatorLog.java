package com.conectafamilia.backend.model.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
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

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "simulator_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulatorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "scenario_id", nullable = false, length = 100)
    private String scenarioId;

    @ElementCollection
    @CollectionTable(name = "simulator_log_choices", joinColumns = @JoinColumn(name = "simulator_log_id"))
    @OrderColumn(name = "choice_order")
    @Builder.Default
    private List<Choice> choicesMade = new ArrayList<>();

    @Column(nullable = false)
    private Boolean completed;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class Choice {
        @Column(name = "step_number")
        private Integer step;

        @Column(name = "choice_text", columnDefinition = "TEXT")
        private String choice;

        @Column(name = "is_correct")
        private Boolean isCorrect;
    }
}
