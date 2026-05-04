package com.conectafamilia.backend.repository.jpa;

import com.conectafamilia.backend.model.entity.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, String> {
    List<ForumPost> findAllByOrderByCreatedAtDesc();
}
