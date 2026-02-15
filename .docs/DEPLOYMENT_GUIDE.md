# Deployment Guide

This guide covers the deployment configuration and infrastructure setup for the CMS application.

## Overview

The CMS application is containerized using Docker and can be deployed to Kubernetes clusters. The deployment includes:

- **Backend**: Spring Boot application with embedded frontend
- **Database**: PostgreSQL 15
- **Message Broker**: Kafka with Zookeeper
- **Monitoring**: Prometheus and Grafana
- **Orchestration**: Kubernetes with auto-scaling

## Docker Deployment

### Local Development

Use Docker Compose for local development:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Kafka on port 9092
- Backend + Frontend on port 8080
- pgAdmin on port 5050
- Kafka UI on port 8081
- Prometheus on port 9090
- Grafana on port 3000

### Docker Optimizations

The Dockerfile includes several optimizations:

1. **Multi-stage builds**: Separate build and runtime stages
2. **Layer caching**: Dependencies cached separately from source code
3. **Alpine images**: Smaller image sizes for Node.js
4. **JRE instead of JDK**: Smaller runtime image
5. **Non-root user**: Enhanced security
6. **Health checks**: Built-in container health monitoring
7. **JVM tuning**: Container-aware memory settings

### Health Checks

All services include health checks:

- **Backend**: `curl -f http://localhost:8080/actuator/health`
- **PostgreSQL**: `pg_isready -U postgres`
- **Kafka**: `kafka-broker-api-versions --bootstrap-server localhost:9092`
- **Zookeeper**: `nc -z localhost 2181`

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Docker registry access
- Ingress controller (nginx recommended)

### Quick Deploy

```powershell
# Deploy to staging
.\deploy-k8s.ps1 -Environment staging

# Deploy to production
.\deploy-k8s.ps1 -Environment production
```

### Manual Deployment

See `k8s/README.md` for detailed manual deployment instructions.

### Kubernetes Resources

#### Deployments
- **backend-deployment.yaml**: Backend application with 2 replicas
- **frontend-deployment.yaml**: Frontend application with 2 replicas
- **postgres-deployment.yaml**: PostgreSQL database
- **kafka-deployment.yaml**: Kafka message broker
- **zookeeper-deployment.yaml**: Zookeeper for Kafka

#### Services
- **backend-service.yaml**: ClusterIP service for backend
- **frontend-service.yaml**: ClusterIP service for frontend
- **postgres-service.yaml**: ClusterIP service for database
- **kafka-service.yaml**: ClusterIP service for Kafka

#### Configuration
- **backend-configmap.yaml**: Application configuration
- **backend-secrets.yaml**: Sensitive credentials
- **namespace.yaml**: Staging and production namespaces

#### Scaling
- **backend-hpa.yaml**: Horizontal Pod Autoscaler (2-10 replicas)
- **frontend-hpa.yaml**: Horizontal Pod Autoscaler (2-6 replicas)

#### Storage
- **postgres-pvc.yaml**: Persistent volume for database (10Gi)

#### Networking
- **ingress.yaml**: Ingress configuration with TLS

### Resource Limits

#### Backend
- **Requests**: 768Mi memory, 500m CPU
- **Limits**: 1536Mi memory, 1500m CPU
- **Replicas**: 2-10 (auto-scaled)

#### Frontend
- **Requests**: 128Mi memory, 100m CPU
- **Limits**: 256Mi memory, 200m CPU
- **Replicas**: 2-6 (auto-scaled)

#### PostgreSQL
- **Requests**: 512Mi memory, 500m CPU
- **Limits**: 1Gi memory, 1000m CPU
- **Storage**: 10Gi persistent volume

### Health Probes

#### Backend Probes
1. **Startup Probe**: `/actuator/health` (30s initial, 10s period, 12 retries)
2. **Liveness Probe**: `/actuator/health/liveness` (90s initial, 10s period)
3. **Readiness Probe**: `/actuator/health/readiness` (60s initial, 5s period)

#### Frontend Probes
1. **Liveness Probe**: `/` (30s initial, 10s period)
2. **Readiness Probe**: `/` (10s initial, 5s period)

## CI/CD Pipeline

### GitLab CI Stages

1. **Build**: Compile backend with Maven
2. **Test**: Run unit and integration tests
3. **Security**: Dependency vulnerability scanning
4. **Docker**: Build and push Docker images
5. **Migrate**: Run database migrations
6. **Deploy**: Deploy to staging/production

### Pipeline Features

- **Automated testing**: Unit and integration tests on every commit
- **Docker image tagging**: Images tagged with commit SHA
- **Manual deployments**: Staging and production require manual approval
- **Database migrations**: Separate migration stage with manual trigger
- **Rollback support**: Previous images available for rollback
- **Environment-specific**: Separate configurations for staging/production

### Environment Variables

Configure these in GitLab CI/CD settings:

**Registry:**
- `CI_REGISTRY`: Docker registry URL
- `CI_REGISTRY_USER`: Registry username
- `CI_REGISTRY_PASSWORD`: Registry password

**Kubernetes:**
- `KUBE_CONTEXT`: Kubernetes context name
- `KUBE_CONFIG`: Kubernetes config file (base64 encoded)

**Database (Staging):**
- `STAGING_DB_URL`: Database connection URL
- `STAGING_DB_USERNAME`: Database username
- `STAGING_DB_PASSWORD`: Database password

## Monitoring

### Prometheus Metrics

Backend exposes Prometheus metrics at `/actuator/prometheus`:

- JVM metrics (memory, threads, GC)
- HTTP request metrics
- Database connection pool metrics
- Custom application metrics

### Grafana Dashboards

Access Grafana at `http://localhost:3000` (Docker) or configure in Kubernetes.

Default credentials:
- Username: `admin`
- Password: `admin`

Import Spring Boot dashboards for monitoring.

### Health Endpoints

- **Health**: `/actuator/health`
- **Liveness**: `/actuator/health/liveness`
- **Readiness**: `/actuator/health/readiness`
- **Info**: `/actuator/info`
- **Metrics**: `/actuator/metrics`
- **Prometheus**: `/actuator/prometheus`

## Security

### Container Security

1. **Non-root user**: Application runs as `appuser`
2. **Minimal base images**: Alpine and JRE-only images
3. **No secrets in images**: Secrets injected at runtime
4. **Read-only filesystem**: Where possible

### Kubernetes Security

1. **Secrets management**: Use Kubernetes secrets or external vault
2. **RBAC**: Role-based access control
3. **Network policies**: Restrict pod-to-pod communication
4. **TLS**: All external traffic encrypted
5. **Resource limits**: Prevent resource exhaustion

### Best Practices

1. **Never commit secrets**: Use environment variables or secret management
2. **Rotate credentials**: Regular password and key rotation
3. **Update dependencies**: Keep base images and dependencies updated
4. **Scan for vulnerabilities**: Regular security scanning
5. **Audit logs**: Enable and monitor audit logging

## Troubleshooting

### Docker Issues

**Container won't start:**
```bash
docker logs cms-backend
docker inspect cms-backend
```

**Database connection issues:**
```bash
docker exec -it cms-postgres psql -U postgres -d cms_db
```

**Kafka issues:**
```bash
docker exec -it cms-kafka kafka-topics --list --bootstrap-server localhost:9092
```

### Kubernetes Issues

**Pod not starting:**
```bash
kubectl describe pod <pod-name> -n cms-production
kubectl logs <pod-name> -n cms-production
```

**Service not accessible:**
```bash
kubectl get endpoints -n cms-production
kubectl describe service backend-service -n cms-production
```

**HPA not scaling:**
```bash
kubectl get hpa -n cms-production
kubectl describe hpa backend-hpa -n cms-production
kubectl top pods -n cms-production
```

## Backup and Recovery

### Database Backup

**Docker:**
```bash
docker exec cms-postgres pg_dump -U postgres cms_db > backup.sql
```

**Kubernetes:**
```bash
kubectl exec -it <postgres-pod> -n cms-production -- \
  pg_dump -U postgres cms_db > backup.sql
```

### Database Restore

**Docker:**
```bash
docker exec -i cms-postgres psql -U postgres cms_db < backup.sql
```

**Kubernetes:**
```bash
kubectl exec -i <postgres-pod> -n cms-production -- \
  psql -U postgres cms_db < backup.sql
```

## Performance Tuning

### JVM Settings

Configured in Dockerfile and Kubernetes deployment:

```
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75.0
-XX:+UseG1GC
-XX:+OptimizeStringConcat
```

### Database Connection Pool

HikariCP settings in `application.properties`:

- Maximum pool size: 10-20 connections
- Minimum idle: 5-10 connections
- Connection timeout: 30 seconds
- Idle timeout: 10 minutes

### Horizontal Scaling

Auto-scaling based on:
- CPU utilization: 70% target
- Memory utilization: 80% target
- Custom metrics: Request rate, response time

## Support

For additional help:
- Kubernetes Guide: `k8s/README.md`
- Developer Guide: `DEVELOPER_GUIDE.md`
- System Architecture: `SYSTEM_ARCHITECTURE.md`
- API Documentation: `API_DOCUMENTATION.md`
