package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.document.ForumPost;
import com.conectafamilia.backend.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/forum")
public class ForumController {

    @Autowired
    private ForumService forumService;

    @GetMapping("/posts")
    public ResponseEntity<List<ForumPost>> getAllPosts() {
        return ResponseEntity.ok(forumService.getAllPosts());
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable String id) {
        return ResponseEntity.ok(forumService.getPostById(id));
    }

    @PostMapping("/posts")
    public ResponseEntity<ForumPost> createPost(@RequestBody ForumPost post) {
        return ResponseEntity.ok(forumService.createPost(post));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ForumPost> addComment(@PathVariable String id, @RequestBody ForumPost.Comment comment) {
        return ResponseEntity.ok(forumService.addComment(id, comment));
    }
}
