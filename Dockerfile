# ========================
# 1. Build Backend (Maven)
# ========================
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app

# Copy only pom.xml first for better layer caching
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# ========================
# 2. Build Frontend (React + Vite)
# ========================
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Copy package files first for better layer caching
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps --silent

# Copy source and build
COPY frontend/ ./

# Pass API URL dynamically (overridable via docker-compose or GitLab CI)
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ========================
# 3. Final Runtime Image
# ========================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy backend JAR
COPY --from=backend-build /app/target/*.jar app.jar

# Copy frontend build into Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist /app/static

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM optimization flags
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+OptimizeStringConcat"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar \
  --spring.datasource.url=${SPRING_DATASOURCE_URL} \
  --spring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
  --spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}"]
