package com.conectafamilia.backend.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "forum_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumPost {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 180)
    private String title;

    @JsonAlias("body")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "author_id", length = 100)
    private String authorId;

    @JsonAlias("author")
    @Column(name = "author_name", length = 120)
    private String authorName;

    @Column(length = 80)
    private String category;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ElementCollection
    @CollectionTable(name = "forum_post_tags", joinColumns = @JoinColumn(name = "forum_post_id"))
    @Column(name = "tag", length = 80)
    @OrderColumn(name = "tag_order")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "forum_post_likes", joinColumns = @JoinColumn(name = "forum_post_id"))
    @Column(name = "user_id", length = 100)
    @Builder.Default
    private List<String> likedBy = new ArrayList<>();

    public int getLikes() {
        return likedBy == null ? 0 : likedBy.size();
    }

    public boolean isLikedBy(String userId) {
        return likedBy != null && likedBy.contains(userId);
    }
    
    @ElementCollection
    @CollectionTable(name = "forum_post_comments", joinColumns = @JoinColumn(name = "forum_post_id"))
    @OrderColumn(name = "comment_order")
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public String getBody() {
        return content;
    }

    public String getAuthor() {
        return authorName;
    }

    public int getReplies() {
        return comments == null ? 0 : comments.size();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Embeddable
    public static class Comment {
        @Column(name = "comment_id", length = 100)
        private String id;

        @Column(name = "author_id", length = 100)
        private String authorId;

        @Column(name = "author_name", length = 120)
        private String authorName;

        @Column(columnDefinition = "TEXT")
        private String content;

        @Column(name = "created_at")
        private LocalDateTime createdAt;
    }
}
