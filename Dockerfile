# ========================
# 1. Build Backend (Maven)
# ========================
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# ========================
# 2. Build Frontend (React + Vite)
# ========================
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# ========================
# 3. Final Runtime Image
# ========================
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy backend JAR
COPY --from=backend-build /app/target/*.jar app.jar

# Copy frontend build into Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist src/main/resources/static

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.datasource.url=${SPRING_DATASOURCE_URL}", "--spring.datasource.username=${SPRING_DATASOURCE_USERNAME}", "--spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}"]