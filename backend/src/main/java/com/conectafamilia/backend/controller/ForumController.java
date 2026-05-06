package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.entity.ForumPost;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/foro")
public class ForumController {

    @Autowired
    private ForumService forumService;

    @GetMapping("/threads")
    public ResponseEntity<List<ForumPost>> getAllThreads() {
        return ResponseEntity.ok(forumService.getAllPosts());
    }

    @GetMapping("/threads/{id}")
    public ResponseEntity<ForumPost> getThreadById(@PathVariable String id) {
        return ResponseEntity.ok(forumService.getPostById(id));
    }

    @PostMapping("/threads")
    public ResponseEntity<ForumPost> createThread(
            @RequestBody ForumPost post,
            org.springframework.security.core.Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            post.setAuthorId(user.getId().toString());
            post.setAuthorName(user.getFullName());
        }
        return ResponseEntity.ok(forumService.createPost(post));
    }

    @PostMapping("/threads/{id}/like")
    public ResponseEntity<ForumPost> toggleLike(
            @PathVariable String id,
            org.springframework.security.core.Authentication authentication) {
        String userId = null;
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            userId = user.getId().toString();
        }
        return ResponseEntity.ok(forumService.toggleLike(id, userId));
    }

    @PostMapping("/threads/{id}/comments")
    public ResponseEntity<ForumPost> addComment(
            @PathVariable String id,
            @RequestBody ForumPost.Comment comment,
            org.springframework.security.core.Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            comment.setAuthorId(user.getId().toString());
            comment.setAuthorName(user.getFullName());
        }
        return ResponseEntity.ok(forumService.addComment(id, comment));
    }

    @PutMapping("/threads/{postId}/comments/{commentId}")
    public ResponseEntity<ForumPost> editComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestBody String newContent,
            org.springframework.security.core.Authentication authentication) {
        String userId = null;
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            userId = user.getId().toString();
        }
        return ResponseEntity.ok(forumService.editComment(postId, commentId, newContent, userId));
    }

    @DeleteMapping("/threads/{postId}/comments/{commentId}")
    public ResponseEntity<ForumPost> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            org.springframework.security.core.Authentication authentication) {
        String userId = null;
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            userId = user.getId().toString();
        }
        return ResponseEntity.ok(forumService.deleteComment(postId, commentId, userId));
    }
}
