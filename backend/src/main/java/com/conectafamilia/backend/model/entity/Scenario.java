package com.conectafamilia.backend.model.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
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
@Table(name = "scenarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scenario {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "scenario_options", joinColumns = @JoinColumn(name = "scenario_id"))
    @OrderColumn(name = "option_order")
    @Builder.Default
    private List<Option> options = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class Option {
        @Column(name = "option_id", length = 20)
        private String id;

        @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
        private String text;

        @Column(columnDefinition = "TEXT")
        private String feedback;

        @Column(name = "is_correct")
        private Boolean isCorrect;
    }
}
