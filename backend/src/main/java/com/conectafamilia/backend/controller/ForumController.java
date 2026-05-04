package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.document.ForumPost;
import com.conectafamilia.backend.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/foro")
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
    public ResponseEntity<ForumPost> createThread(@RequestBody ForumPost post, org.springframework.security.core.Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof com.conectafamilia.backend.model.entity.User) {
            com.conectafamilia.backend.model.entity.User user = (com.conectafamilia.backend.model.entity.User) authentication.getPrincipal();
            post.setAuthorId(user.getId().toString());
            post.setAuthorName(user.getFullName());
        }
        return ResponseEntity.ok(forumService.createPost(post));
    }

    @PostMapping("/threads/{id}/like")
    public ResponseEntity<ForumPost> toggleLike(@PathVariable String id) {
        return ResponseEntity.ok(forumService.toggleLike(id));
    }

    @PostMapping("/threads/{id}/comments")
    public ResponseEntity<ForumPost> addComment(@PathVariable String id, @RequestBody ForumPost.Comment comment) {
        return ResponseEntity.ok(forumService.addComment(id, comment));
    }
}
