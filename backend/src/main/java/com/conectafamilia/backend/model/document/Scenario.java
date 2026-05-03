package com.conectafamilia.backend.model.document;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "scenarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scenario {

    @Id
    private String id;
    private String title;
    private String description;
    private List<Option> options;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Option {
        private String id;
        private String text;
        private String feedback;
        private Boolean isCorrect;
    }
}
