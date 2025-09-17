# Kafka Integration Guide

## Overview
This CMS application now includes Apache Kafka for event-driven architecture and real-time messaging.

## Features Added
- **Event Publishing**: Customer CRUD operations publish events to Kafka
- **Event Consumption**: Automatic processing of customer events
- **Health Monitoring**: Kafka connectivity health checks
- **Containerized Setup**: Docker Compose includes Kafka + Zookeeper
- **Kubernetes Support**: K8s manifests for production deployment

## Topics
- `customer-events`: Customer lifecycle events (CREATED, UPDATED, DELETED)
- `notifications`: General notification messages
- `health-check`: System health monitoring

## Local Development

### Start with Docker Compose
```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Zookeeper (port 2181)
- Kafka (port 9092)
- Kafka UI (port 8081)
- Backend + Frontend (port 8080)

### Access Kafka UI
Visit http://localhost:8081 to monitor topics, messages, and consumers.

### Manual Kafka Commands
```bash
# List topics
docker exec cms-kafka kafka-topics --bootstrap-server localhost:9092 --list

# Create topic
docker exec cms-kafka kafka-topics --bootstrap-server localhost:9092 --create --topic test-topic

# Consume messages
docker exec cms-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic customer-events --from-beginning

# Produce messages
docker exec -it cms-kafka kafka-console-producer --bootstrap-server localhost:9092 --topic customer-events
```

## Production Deployment

### Kubernetes
```bash
# Deploy Kafka infrastructure
kubectl apply -f k8s/zookeeper-deployment.yaml
kubectl apply -f k8s/kafka-deployment.yaml

# Deploy application
kubectl apply -f k8s/
```

### Environment Variables
- `KAFKA_BOOTSTRAP_SERVERS`: Kafka broker addresses (default: localhost:9092)
- `SPRING_KAFKA_CONSUMER_GROUP_ID`: Consumer group ID (default: cms-group)

## Event Schema

### CustomerEvent
```json
{
  "customerId": 123,
  "eventType": "CREATED",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "sectorName": "Technology",
  "timestamp": "2025-01-15T10:30:00",
  "performedBy": "admin"
}
```

## Monitoring
- Health endpoint: `GET /api/health`
- Kafka UI: http://localhost:8081
- Application logs show Kafka connectivity status

## Troubleshooting

### Common Issues
1. **Kafka connection failed**: Ensure Kafka is running and accessible
2. **Topic not found**: Topics are auto-created, but check Kafka logs
3. **Consumer lag**: Monitor consumer groups in Kafka UI

### Logs
```bash
# Backend logs
docker logs cms-backend

# Kafka logs
docker logs cms-kafka

# Zookeeper logs
docker logs cms-zookeeper
```