# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the CMS application.

## Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured to access your cluster
- Docker registry access
- Ingress controller (nginx-ingress recommended)
- cert-manager for TLS certificates (optional)

## Quick Start

### 1. Deploy to Staging

```bash
# From project root
.\deploy-k8s.ps1 -Environment staging
```

### 2. Deploy to Production

```bash
# From project root
.\deploy-k8s.ps1 -Environment production
```

## Manual Deployment

### Step 1: Create Namespaces

```bash
kubectl apply -f namespace.yaml
```

### Step 2: Create ConfigMaps and Secrets

```bash
# Update secrets with production values first!
kubectl apply -f backend-configmap.yaml -n cms-production
kubectl apply -f backend-secrets.yaml -n cms-production
```

### Step 3: Deploy Database

```bash
kubectl apply -f postgres-pvc.yaml -n cms-production
kubectl apply -f postgres-deployment.yaml -n cms-production
```

### Step 4: Deploy Kafka Infrastructure

```bash
kubectl apply -f zookeeper-deployment.yaml -n cms-production
kubectl apply -f kafka-deployment.yaml -n cms-production
```

### Step 5: Deploy Application

```bash
# Backend
kubectl apply -f backend-deployment.yaml -n cms-production
kubectl apply -f backend-service.yaml -n cms-production
kubectl apply -f backend-hpa.yaml -n cms-production

# Frontend
kubectl apply -f frontend-deployment.yaml -n cms-production
kubectl apply -f frontend-service.yaml -n cms-production
kubectl apply -f frontend-hpa.yaml -n cms-production
```

### Step 6: Configure Ingress

```bash
# Update ingress.yaml with your domain first!
kubectl apply -f ingress.yaml -n cms-production
```

## Configuration

### Environment Variables

Update `backend-configmap.yaml` and `backend-secrets.yaml` with your environment-specific values:

**ConfigMap (backend-configmap.yaml):**
- Database URL
- Kafka bootstrap servers
- Application settings

**Secrets (backend-secrets.yaml):**
- Database credentials
- JWT secret
- Encryption keys

### Resource Limits

Default resource limits are configured for moderate workloads:

**Backend:**
- Requests: 768Mi memory, 500m CPU
- Limits: 1536Mi memory, 1500m CPU

**Frontend:**
- Requests: 128Mi memory, 100m CPU
- Limits: 256Mi memory, 200m CPU

Adjust these in the deployment files based on your workload.

### Horizontal Pod Autoscaling

HPA is configured for both backend and frontend:

**Backend:**
- Min replicas: 2
- Max replicas: 10
- Target CPU: 70%
- Target Memory: 80%

**Frontend:**
- Min replicas: 2
- Max replicas: 6
- Target CPU: 70%
- Target Memory: 80%

## Health Checks

The backend includes three types of probes:

1. **Liveness Probe**: `/actuator/health/liveness`
   - Checks if the application is running
   - Restarts pod if failing

2. **Readiness Probe**: `/actuator/health/readiness`
   - Checks if the application is ready to serve traffic
   - Removes pod from service if failing

3. **Startup Probe**: `/actuator/health`
   - Gives the application time to start
   - Prevents premature liveness/readiness checks

## Monitoring

Access application metrics at:
- Prometheus metrics: `http://<backend-service>:8080/actuator/prometheus`
- Health endpoint: `http://<backend-service>:8080/actuator/health`
- Info endpoint: `http://<backend-service>:8080/actuator/info`

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n cms-production
kubectl describe pod <pod-name> -n cms-production
kubectl logs <pod-name> -n cms-production
```

### Check Service Status

```bash
kubectl get services -n cms-production
kubectl describe service backend-service -n cms-production
```

### Check Ingress

```bash
kubectl get ingress -n cms-production
kubectl describe ingress cms-ingress -n cms-production
```

### Scale Deployments

```bash
# Scale backend
kubectl scale deployment backend-deployment --replicas=5 -n cms-production

# Scale frontend
kubectl scale deployment frontend-deployment --replicas=3 -n cms-production
```

### Restart Deployments

```bash
kubectl rollout restart deployment/backend-deployment -n cms-production
kubectl rollout restart deployment/frontend-deployment -n cms-production
```

### Check HPA Status

```bash
kubectl get hpa -n cms-production
kubectl describe hpa backend-hpa -n cms-production
```

## Database Migrations

Database migrations should be run before deploying new versions:

```bash
# Using the CI/CD pipeline (recommended)
# Trigger the db-migrate job in GitLab CI

# Or manually using kubectl
kubectl run migration-job --rm -it --restart=Never \
  --image=maven:3.9.6-eclipse-temurin-17 \
  --env="SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-service:5432/cms_db" \
  --env="SPRING_DATASOURCE_USERNAME=postgres" \
  --env="SPRING_DATASOURCE_PASSWORD=<password>" \
  -n cms-production \
  -- mvn liquibase:update
```

## Backup and Restore

### Backup PostgreSQL

```bash
kubectl exec -it <postgres-pod> -n cms-production -- \
  pg_dump -U postgres cms_db > backup.sql
```

### Restore PostgreSQL

```bash
kubectl exec -i <postgres-pod> -n cms-production -- \
  psql -U postgres cms_db < backup.sql
```

## Security Best Practices

1. **Never commit secrets to Git**
   - Use external secret management (e.g., HashiCorp Vault, AWS Secrets Manager)
   - Or create secrets manually: `kubectl create secret generic ...`

2. **Use TLS for all external traffic**
   - Configure cert-manager for automatic certificate management
   - Update ingress.yaml with your TLS configuration

3. **Enable RBAC**
   - Create service accounts with minimal permissions
   - Use network policies to restrict pod-to-pod communication

4. **Regular updates**
   - Keep base images updated
   - Monitor for security vulnerabilities
   - Apply security patches promptly

## CI/CD Integration

The `.gitlab-ci.yml` file includes automated deployment stages:

1. **Build**: Compile and package the application
2. **Test**: Run unit and integration tests
3. **Security**: Scan for vulnerabilities
4. **Docker**: Build and push Docker images
5. **Migrate**: Run database migrations
6. **Deploy**: Deploy to staging/production

Deployments to staging and production are manual triggers for safety.

## Support

For issues or questions, refer to:
- Main README: `../README.md`
- Developer Guide: `../.docs/DEVELOPER_GUIDE.md`
- System Architecture: `../.docs/SYSTEM_ARCHITECTURE.md`
