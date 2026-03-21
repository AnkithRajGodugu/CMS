package com.example.cms.repository;

import com.example.cms.entity.ContentAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentAssetRepository extends JpaRepository<ContentAsset, Long> {
    List<ContentAsset> findByProjectId(Long projectId);
    List<ContentAsset> findByType(ContentAsset.AssetType type);
}
