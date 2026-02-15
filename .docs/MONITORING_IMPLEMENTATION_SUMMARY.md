# Monitoring and Alerting Implementation Summary

## Overview

This document summarizes the implementation of comprehensive monitoring and alerting capabilities for the CMS application, including application logging, performance monitoring, and error rate tracking.

## Implementation Details

### 1. Application Logging (Task 15.1)

#### Logback Configuration
- **File**: `backend/src/main/resources/logback-spring.xml`
- **Features**:
  - Profile-based configuration (dev, prod, test)
  - JSON structured logging for production using Logstash encoder
  - Console logging for development with readable format
  - File-based logging with rolling policies
  - Separate error log file with 90-day retention
  - Async appenders for better performance
  - MDC (Mapped Diagnostic Context) support for contextual logging

#### Log Rotation and Retention
- **Daily rollover**: Logs rotate daily at midnight
- **Size limit**: 10MB per file
- **Retention**: 30 days for regular logs, 90 days for error logs
- **Total size cap**: 1GB for regular logs, 500MB for error logs

#### Logging Utility
- **File**: `backend/src/main/java/com/example/cms/util/LoggingUtil.java`
- **Purpose**: Provides MDC context management for structured logging
- **Context Keys**:
  - `userId`: Current user ID
  - `sectorId`: Current sector ID
  - `organizationId`: Current organization ID
  - `requestId`: Unique request identifier
  - `ipAddress`: Client IP address
  - `action`: Action being performed
  - `resourceType`: Type of resource being accessed
  - `resourceId`: Resource identifier

#### Logging Filter
- **File**: `backend/src/main/java/com/example/cms/filter/LoggingFilter.java`
- **Order**: Executes first (@Order(1))
- **Features**:
  - Generates unique request ID for each request
  - Adds request ID to response header (X-Request-ID)
  - Extracts client IP address (handles proxy headers)
  - Logs request start and completion with duration
  - Records performance and error metrics
  - Clears MDC context after request

#### Enhanced Sector Authorization Filter
- **File**: `backend/src/main/java/com/example/cms/security/SectorAuthorizationFilter.java`
- **Enhancement**: Adds sector context (userId, sectorId, organizationId) to MDC for all sector-specific requests

#### Log Levels by Component
- Application code: INFO
- Security operations: DEBUG
- Sector operations: DEBUG/INFO
- Audit operations: INFO
- Database queries: DEBUG
- Kafka: WARN
- Spring Framework: INFO

### 2. Performance Monitoring (Task 15.2)

#### Performance Monitoring Service
- **File**: `backend/src/main/java/com/example/cms/service/PerformanceMonitoringService.java`
- **Features**:
  - Tracks API endpoint response times
  - Monitors database query execution times
  - Identifies slow requests (>2000ms threshold)
  - Identifies slow queries (>2000ms threshold)
  - Calculates min, max, and average durations
  - Tracks slow request/query percentages
  - Thread-safe metrics using AtomicLong

#### Metrics Tracked
- **Endpoint Metrics**:
  - Total requests
  - Average duration
  - Min/max duration
  - Slow request count and percentage
  
- **Query Metrics**:
  - Total queries
  - Average duration
  - Min/max duration
  - Slow query count and percentage

#### Slow Query Logging
- **Configuration**: `backend/src/main/resources/application.properties`
- **Settings**:
  - `spring.jpa.properties.hibernate.session.events.log.LOG_QUERIES_SLOWER_THAN_MS=2000`
  - `logging.level.org.hibernate.SQL_SLOW=WARN`

#### Metrics Controller
- **File**: `backend/src/main/java/com/example/cms/controller/MetricsController.java`
- **Endpoints** (Admin only):
  - `GET /api/metrics/endpoints` - All endpoint metrics
  - `GET /api/metrics/endpoints/{method}/{path}` - Specific endpoint metrics
  - `GET /api/metrics/queries` - All query metrics
  - `GET /api/metrics/summary` - Performance summary
  - `POST /api/metrics/reset` - Reset all metrics

### 3. Error Rate Monitoring (Task 15.3)

#### Error Rate Monitoring Service
- **File**: `backend/src/main/java/com/example/cms/service/ErrorRateMonitoringService.java`
- **Features**:
  - Tracks success and error rates per endpoint
  - Categorizes errors by type (SERVER_ERROR, NOT_FOUND, FORBIDDEN, etc.)
  - Monitors overall error rate
  - Triggers alerts when error rate exceeds 5%
  - Generates daily error summary reports
  - Thread-safe metrics using AtomicLong

#### Error Tracking
- **Error Types**:
  - SERVER_ERROR (5xx)
  - NOT_FOUND (404)
  - FORBIDDEN (403)
  - UNAUTHORIZED (401)
  - BAD_REQUEST (400)
  - CLIENT_ERROR (4xx)
  - UNKNOWN_ERROR

#### Alert Mechanism
- **Threshold**: 5% error rate
- **Minimum requests**: 100 requests before checking
- **Action**: Logs critical alert (in production, would send to monitoring service)

#### Daily Summary Report
- **Schedule**: Runs at midnight daily (@Scheduled)
- **Content**:
  - Total requests and errors
  - Overall error rate
  - Top 10 error endpoints
  - Error counts by type
- **Retention**: Stored in memory (can be persisted to database)

#### Enhanced Metrics Endpoints
- **Additional Endpoints** (Admin only):
  - `GET /api/metrics/errors` - Error statistics
  - `GET /api/metrics/errors/endpoint?endpoint={path}` - Endpoint error rate
  - `GET /api/metrics/errors/daily/{date}` - Daily summary for specific date
  - `GET /api/metrics/errors/daily` - All daily summaries

### 4. Scheduling Support

#### Application Configuration
- **File**: `backend/src/main/java/com/example/cms/CmsApplication.java`
- **Enhancement**: Added `@EnableScheduling` annotation to enable scheduled tasks

## Dependencies Added

### Logstash Encoder
```xml
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>7.4</version>
</dependency>
```

## Usage Examples

### Accessing Metrics (Admin Only)

#### Get Performance Summary
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/metrics/summary
```

#### Get Error Statistics
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/metrics/errors
```

#### Get Daily Error Summary
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/metrics/errors/daily/2025-10-23
```

#### Reset All Metrics
```bash
curl -X POST -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/metrics/reset
```

### Using Logging Utility in Code

```java
// Add context to logs
LoggingUtil.setUserId(user.getId());
LoggingUtil.setSectorId(sector.getId());
LoggingUtil.setAction("CREATE_ACCOUNT");

// Log with context
log.info("Creating new account");

// Clear context when done
LoggingUtil.clear();
```

### Recording Performance Metrics

```java
// Automatically recorded by LoggingFilter for all API requests
// Manual recording:
performanceMonitoringService.recordEndpointResponseTime(
    "/api/accounts", 
    "POST", 
    durationMs
);

performanceMonitoringService.recordQueryExecutionTime(
    "findAccountsByUserId", 
    durationMs
);
```

### Recording Error Metrics

```java
// Automatically recorded by LoggingFilter based on HTTP status
// Manual recording:
errorRateMonitoringService.recordError(
    "/api/accounts",
    "VALIDATION_ERROR",
    "Invalid account data"
);

errorRateMonitoringService.recordSuccess("/api/accounts");
```

## Log File Locations

### Development
- **Console**: Standard output
- **File**: `logs/cms-application.log`
- **Error File**: `logs/cms-application-error.log`

### Production
- **Console**: JSON format to stdout
- **File**: `logs/cms-application-json.log`
- **Error File**: `logs/cms-application-error.log`

## Monitoring Best Practices

1. **Log Levels**:
   - Use DEBUG for detailed troubleshooting
   - Use INFO for normal operations
   - Use WARN for potential issues
   - Use ERROR for failures

2. **MDC Context**:
   - Always set userId and sectorId for authenticated requests
   - Use requestId for tracing requests across services
   - Clear MDC context after processing

3. **Performance Monitoring**:
   - Review slow request logs regularly
   - Optimize endpoints with high average response times
   - Monitor slow query percentages

4. **Error Monitoring**:
   - Investigate when error rate exceeds 5%
   - Review daily summaries for trends
   - Focus on endpoints with high error rates

## Future Enhancements

1. **Integration with External Monitoring**:
   - Prometheus metrics export
   - Grafana dashboards
   - ELK stack integration
   - Application Performance Monitoring (APM) tools

2. **Advanced Alerting**:
   - Email notifications for critical errors
   - Slack/Teams integration
   - PagerDuty integration
   - Custom alert rules

3. **Metrics Persistence**:
   - Store metrics in database
   - Historical trend analysis
   - Long-term retention

4. **Distributed Tracing**:
   - OpenTelemetry integration
   - Jaeger/Zipkin support
   - Cross-service request tracing

## Requirements Satisfied

- **Requirement 10.1**: Comprehensive error logging with severity, timestamp, user context, and stack trace
- **Requirement 10.3**: Performance monitoring with slow query and API response time logging
- **Requirement 10.4**: Error rate tracking per sector with daily summary reports
- **Requirement 10.5**: Automated alerts when error rates exceed 5%
- **Requirement 9.3**: Slow query logging for queries exceeding 2 seconds

## Testing

To test the monitoring implementation:

1. **Start the application**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Make API requests** to generate metrics

3. **Check logs**:
   - View console output for request logs
   - Check `logs/` directory for file-based logs

4. **Access metrics** (requires admin role):
   - Performance summary: `GET /api/metrics/summary`
   - Error statistics: `GET /api/metrics/errors`

5. **Verify daily summary**:
   - Wait for midnight or manually trigger the scheduled task
   - Check logs for daily summary report

## Conclusion

The monitoring and alerting implementation provides comprehensive visibility into application performance, errors, and system health. The structured logging, performance tracking, and error rate monitoring enable proactive identification and resolution of issues, ensuring high availability and reliability of the CMS application.
