package com.conectafamilia.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.conectafamilia.backend.model.entity.ForumPost;
import com.conectafamilia.backend.repository.jpa.ForumPostRepository;

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
        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        if (post.getTags() == null) {
            post.setTags(new ArrayList<>());
        }
        if (post.getLikedBy() == null) {
            post.setLikedBy(new ArrayList<>());
        }
        return forumPostRepository.save(post);
    }

    public ForumPost addComment(String postId, ForumPost.Comment comment) {
        ForumPost post = getPostById(postId);
        comment.setId(UUID.randomUUID().toString());
        comment.setCreatedAt(LocalDateTime.now());
        
        post.getComments().add(comment);
        return forumPostRepository.save(post);
    }

    public ForumPost editComment(String postId, String commentId, String newContent, String userId) {
        ForumPost post = getPostById(postId);
        ForumPost.Comment comment = post.getComments().stream()
            .filter(c -> c.getId().equals(commentId) && c.getAuthorId().equals(userId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Comment not found or not authorized"));
        comment.setContent(newContent);
        return forumPostRepository.save(post);
    }

    public ForumPost deleteComment(String postId, String commentId, String userId) {
        ForumPost post = getPostById(postId);
        post.getComments().removeIf(c -> c.getId().equals(commentId) && c.getAuthorId().equals(userId));
        return forumPostRepository.save(post);
    }

    public ForumPost toggleLike(String postId, String userId) {
        ForumPost post = getPostById(postId);
        if (post.getLikedBy() == null) {
            post.setLikedBy(new ArrayList<>());
        }
        if (post.getLikedBy().contains(userId)) {
            post.getLikedBy().remove(userId);
        } else {
            post.getLikedBy().add(userId);
        }
        return forumPostRepository.save(post);
    }
}
