package com.example.cms.repository;

import com.example.cms.entity.User;
import com.example.cms.entity.UserVitals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserVitalsRepository extends JpaRepository<UserVitals, Long> {
    Optional<UserVitals> findByUser(User user);
}
