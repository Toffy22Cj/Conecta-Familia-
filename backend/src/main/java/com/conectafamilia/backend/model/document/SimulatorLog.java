package com.conectafamilia.backend.model.document;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "simulator_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulatorLog {

    @Id
    private String id;

    private Long userId; // Referencia a MariaDB

    private String scenarioId;

    private List<Choice> choicesMade;

    private Boolean completed;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Choice {
        private Integer step;
        private String choice;
        private Boolean isCorrect;
    }
}
