# Kubernetes Deployment Script for CMS
# Usage: .\deploy-k8s.ps1 -Environment <staging|production>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("staging", "production")]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying CMS to $Environment environment..." -ForegroundColor Cyan

# Set namespace based on environment
$namespace = "cms-$Environment"

# Create namespace if it doesn't exist
Write-Host "📦 Creating namespace: $namespace" -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml

# Apply ConfigMaps and Secrets
Write-Host "🔧 Applying ConfigMaps and Secrets..." -ForegroundColor Yellow
kubectl apply -f k8s/backend-configmap.yaml -n $namespace
kubectl apply -f k8s/backend-secrets.yaml -n $namespace

# Deploy Database
Write-Host "🗄️ Deploying PostgreSQL..." -ForegroundColor Yellow
kubectl apply -f k8s/postgres-pvc.yaml -n $namespace
kubectl apply -f k8s/postgres-deployment.yaml -n $namespace

# Wait for PostgreSQL to be ready
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=postgres -n $namespace --timeout=300s

# Deploy Kafka and Zookeeper
Write-Host "📨 Deploying Kafka and Zookeeper..." -ForegroundColor Yellow
kubectl apply -f k8s/zookeeper-deployment.yaml -n $namespace
kubectl apply -f k8s/kafka-deployment.yaml -n $namespace

# Wait for Kafka to be ready
Write-Host "⏳ Waiting for Kafka to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Deploy Backend
Write-Host "🔧 Deploying Backend..." -ForegroundColor Yellow
kubectl apply -f k8s/backend-deployment.yaml -n $namespace
kubectl apply -f k8s/backend-service.yaml -n $namespace
kubectl apply -f k8s/backend-hpa.yaml -n $namespace

# Deploy Frontend
Write-Host "🎨 Deploying Frontend..." -ForegroundColor Yellow
kubectl apply -f k8s/frontend-deployment.yaml -n $namespace
kubectl apply -f k8s/frontend-service.yaml -n $namespace
kubectl apply -f k8s/frontend-hpa.yaml -n $namespace

# Apply Ingress
Write-Host "🌐 Applying Ingress..." -ForegroundColor Yellow
kubectl apply -f k8s/ingress.yaml -n $namespace

# Wait for deployments to be ready
Write-Host "⏳ Waiting for deployments to be ready..." -ForegroundColor Yellow
kubectl rollout status deployment/backend-deployment -n $namespace --timeout=5m
kubectl rollout status deployment/frontend-deployment -n $namespace --timeout=5m

# Display deployment status
Write-Host "`n✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "`n📊 Deployment Status:" -ForegroundColor Cyan
kubectl get pods -n $namespace
kubectl get services -n $namespace
kubectl get ingress -n $namespace

Write-Host "`n🔗 Access URLs:" -ForegroundColor Cyan
$ingressHost = kubectl get ingress cms-ingress -n $namespace -o jsonpath='{.spec.rules[0].host}'
Write-Host "Application: https://$ingressHost" -ForegroundColor Green
Write-Host "Backend API: https://$ingressHost/api" -ForegroundColor Green
Write-Host "Health Check: https://$ingressHost/actuator/health" -ForegroundColor Green
