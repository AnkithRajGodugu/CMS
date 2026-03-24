# =========================
# 1. Build Backend (Spring Boot)
# =========================
FROM maven:3.9.9-eclipse-temurin-17 AS backend-build
WORKDIR /build/backend

# Cache dependencies first
COPY backend/pom.xml .
RUN mvn -B -q dependency:go-offline

# Build backend
COPY backend/src ./src
RUN mvn -B -q clean package -DskipTests

# =========================
# 2. Build Frontend (React + Vite)
# =========================
FROM node:20-alpine AS frontend-build
WORKDIR /build/frontend

# Cache npm dependencies
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps --silent

# Build frontend
COPY frontend/ ./

# API URL injected at build time (override via docker-compose)
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# =========================
# 3. Runtime Image
# =========================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Security: non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy backend JAR
COPY --from=backend-build /build/backend/target/*.jar app.jar

# Copy frontend static assets (served by Spring Boot)
COPY --from=frontend-build /build/frontend/dist /app/static

# Permissions
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8081

# JVM container tuning
ENV JAVA_OPTS="\
-XX:+UseContainerSupport \
-XX:MaxRAMPercentage=75.0 \
-XX:+UseG1GC \
-XX:+OptimizeStringConcat"

ENV SPRING_PROFILES_ACTIVE=prod

# Healthcheck (requires actuator health enabled)
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
