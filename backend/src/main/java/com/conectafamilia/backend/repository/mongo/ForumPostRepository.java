package com.conectafamilia.backend.repository.mongo;

import com.conectafamilia.backend.model.document.ForumPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends MongoRepository<ForumPost, String> {
    List<ForumPost> findAllByOrderByCreatedAtDesc();
}
