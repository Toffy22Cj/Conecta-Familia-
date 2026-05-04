package com.conectafamilia.backend.service;

import com.conectafamilia.backend.model.entity.ForumPost;
import com.conectafamilia.backend.repository.jpa.ForumPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ForumService {

    @Autowired
    private ForumPostRepository forumPostRepository;

    public List<ForumPost> getAllPosts() {
        return forumPostRepository.findAllByOrderByCreatedAtDesc();
    }

    public ForumPost getPostById(String id) {
        return forumPostRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public ForumPost createPost(ForumPost post) {
        post.setCreatedAt(LocalDateTime.now());
        return forumPostRepository.save(post);
    }

    public ForumPost addComment(String postId, ForumPost.Comment comment) {
        ForumPost post = getPostById(postId);
        comment.setId(UUID.randomUUID().toString());
        comment.setCreatedAt(LocalDateTime.now());
        
        post.getComments().add(comment);
        return forumPostRepository.save(post);
    }

    public ForumPost toggleLike(String postId) {
        ForumPost post = getPostById(postId);
        post.setLikes(post.getLikes() + 1); // Simple implementation
        return forumPostRepository.save(post);
    }
}
