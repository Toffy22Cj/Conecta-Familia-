package com.conectafamilia.backend.model.dto;

import com.conectafamilia.backend.model.entity.Challenge;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChallengeResponse {
    private String id;
    private String title;
    private String description;
    private Integer estimatedMinutes;
    private String category;
    private boolean completed;

    public static ChallengeResponse from(Challenge challenge, boolean completed) {
        return new ChallengeResponse(
                challenge.getId(),
                challenge.getTitle(),
                challenge.getDescription(),
                challenge.getEstimatedMinutes(),
                challenge.getCategory(),
                completed);
    }
}
