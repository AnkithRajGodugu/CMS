# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
## [2025-10-22]
### Added
- React + Vite frontend and Docker setup
- Sector entity, role-based access, and report endpoints
- CI/CD pipeline and Maven/Gradle build updates
- Kafka and Zookeeper setup for event streaming
- PostgreSQL test database configuration with Testcontainers
- Sector relation to Customer entity
- Comprehensive documentation files and integration guides

### Changed
- Refactored CI/CD configuration and application properties for improved test support
- Updated Maven Compiler Plugin to Java 17 and enabled Lombok annotation processing
- Refactored database configuration to use hardcoded values and removed environment variables from Docker setup
- Updated .gitignore to ignore build, gradle, .kiro, and .idea directories
- Updated frontend theme provider and various frontend components
- Refactored test jobs and pipeline scripts for better compatibility

### Removed
- Deleted duplicate datasource properties from application-test.properties
- Removed datasource configuration from application.properties to prevent test profile override issues
- Deleted comprehensive documentation files to streamline project resources
