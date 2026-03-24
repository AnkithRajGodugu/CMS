package com.example.cms.repository;

import com.example.cms.entity.ContentAsset;
import com.example.cms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentAssetRepository extends JpaRepository<ContentAsset, Long> {
    List<ContentAsset> findByProjectId(Long projectId);

    Page<ContentAsset> findByUser(User user, Pageable pageable);
    List<ContentAsset> findByType(ContentAsset.AssetType type);
}
