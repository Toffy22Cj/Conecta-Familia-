package com.conectafamilia.backend.model.document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "forum_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumPost {

    @Id
    private String id;
    private String title;
    private String content;
    private String authorId;
    private String authorName; // Denormalized for read performance
    private LocalDateTime createdAt;
    private List<String> tags;
    private int likes;
    
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Comment {
        private String id;
        private String authorId;
        private String authorName;
        private String content;
        private LocalDateTime createdAt;
    }
}
