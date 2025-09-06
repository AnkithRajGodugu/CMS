# Use official OpenJDK 17 image as the base
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven configuration and source code
COPY pom.xml .
COPY src ./src

# Copy application.properties
COPY src/main/resources/application.properties ./src/main/resources/

# Install Maven and build the application
RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "target/cms-0.0.1-SNAPSHOT.jar"]