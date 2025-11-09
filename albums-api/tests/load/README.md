# Albums API Load Testing

This directory contains load testing configurations and scripts for the Albums API using Azure Load Testing and Apache JMeter.

## Overview

The load test simulates progressive load on the Albums API, ramping from 0 to 1000 requests per second across three phases:

1. **Warm-up Phase** (1 minute): 100 concurrent users
2. **Medium Load Phase** (2 minutes): 500 concurrent users  
3. **Peak Load Phase** (2 minutes): 1000 concurrent users

**Total duration**: ~5 minutes

## Test Scenarios

The test simulates realistic user behavior with the following distribution:

### Medium Load (500 users)
- 70% GET all albums (`/albums`)
- 20% GET single album (`/albums/{id}`)
- 10% POST create album

### Peak Load (1000 users)
- 60% GET all albums
- 25% GET single album
- 10% POST create album
- 5% PUT update album

## Files

- **`album-api-load-test.jmx`**: JMeter test plan with progressive load scenarios
- **`load-test.yaml`**: Azure Load Testing configuration with pass/fail criteria
- **`run-load-test.ps1`**: PowerShell script to execute load tests locally or in Azure
- **`deploy-load-test.ps1`**: PowerShell script to deploy load test to Azure Load Testing

## Prerequisites

### For Local Execution (JMeter)
- [Apache JMeter 5.6+](https://jmeter.apache.org/download_jmeter.cgi)
- Java 8 or higher

### For Azure Load Testing
- Azure subscription
- Azure CLI (`az`) installed and authenticated
- Azure Load Testing resource created

## Running Load Tests

### Option 1: Run Locally with JMeter

```powershell
# Navigate to the load test directory
cd albums-api/tests/load

# Run with JMeter GUI for configuration/debugging
jmeter -t album-api-load-test.jmx

# Run in non-GUI mode (recommended for actual testing)
jmeter -n -t album-api-load-test.jmx -l results.jtl -e -o reports/

# Override parameters
jmeter -n -t album-api-load-test.jmx `
  -JAPI_HOST=localhost:3000 `
  -JAPI_PROTOCOL=http `
  -l results-local.jtl
```

### Option 2: Run in Azure Load Testing

#### Step 1: Create Azure Load Testing Resource

```powershell
# Set variables
$resourceGroup = "rg-albums-loadtest"
$location = "eastus"
$loadTestResource = "loadtest-albums-api"

# Create resource group (if not exists)
az group create --name $resourceGroup --location $location

# Create Azure Load Testing resource
az load create `
  --name $loadTestResource `
  --resource-group $resourceGroup `
  --location $location
```

#### Step 2: Deploy and Run Load Test

```powershell
# Deploy the test
.\deploy-load-test.ps1 -ResourceGroup $resourceGroup -LoadTestResource $loadTestResource

# Or run the test directly
.\run-load-test.ps1 -ResourceGroup $resourceGroup -LoadTestResource $loadTestResource
```

#### Using Azure Portal

1. Navigate to your Azure Load Testing resource
2. Click **"Tests"** → **"+ Create"** → **"Upload a JMeter script"**
3. Upload `album-api-load-test.jmx`
4. Upload `load-test.yaml` as the test configuration
5. Configure environment variables if needed
6. Click **"Review + Create"** → **"Create"**
7. Run the test from the **"Test Runs"** page

## Pass/Fail Criteria

The test automatically evaluates the following metrics:

| Metric | Threshold | Action |
|--------|-----------|--------|
| Average response time | > 1000ms | Continue |
| P95 response time | > 2000ms | Continue |
| P99 response time | > 3000ms | Continue |
| Error percentage | > 5% | **Stop** |
| Avg requests/sec | < 500 | Continue |

**Auto-stop**: Test stops automatically if error rate exceeds 90% for 60 seconds.

## Analyzing Results

### JMeter HTML Report

After running locally, open `reports/index.html` in a browser to view:
- Response times over time
- Throughput graphs
- Error percentages
- Statistics summary

### Azure Load Testing Dashboard

In the Azure portal, view:
- Real-time test metrics
- Response time percentiles (P50, P90, P95, P99)
- Requests per second
- Error rate
- Client-side metrics
- Server-side metrics (if app components configured)

## Customizing the Test

### Modify Load Pattern

Edit `album-api-load-test.jmx` Thread Group properties:
- `num_threads`: Number of concurrent users
- `ramp_time`: Time to ramp up all users (seconds)
- `duration`: Test duration (seconds)
- `delay`: Delay before starting (seconds)

### Change Target URL

Edit `load-test.yaml`:
```yaml
env:
  - name: API_HOST
    value: your-api-host.azurecontainerapps.io
```

Or override via JMeter properties:
```powershell
jmeter -n -t album-api-load-test.jmx -JAPI_HOST=your-api.com
```

### Adjust Success Criteria

Edit `load-test.yaml` `failureCriteria` section to modify thresholds.

## Monitoring Application Performance

To correlate load test results with application telemetry:

1. Configure `appComponents` in `load-test.yaml` with your Container App resource ID
2. During test execution, view Container App metrics in Azure Portal
3. Check Application Insights for detailed traces and exceptions
4. Monitor Container App logs for errors

## Best Practices

1. **Start Small**: Begin with lower user counts and shorter durations
2. **Warm-up**: Always include a warm-up phase to stabilize the application
3. **Think Time**: Use realistic think times between requests
4. **Monitor Resources**: Watch CPU, memory, and network metrics
5. **Baseline Tests**: Run baseline tests before making changes
6. **Consistent Environment**: Test against a dedicated environment, not production
7. **Data Cleanup**: For write operations, ensure test data doesn't accumulate

## Troubleshooting

### High Error Rates
- Check API logs for server-side errors
- Verify network connectivity
- Ensure the API can handle the load (scale up if needed)
- Check for rate limiting or throttling

### Low Throughput
- Increase engine instances in `load-test.yaml`
- Reduce think time in JMeter test plan
- Check if the API is the bottleneck or the load generators

### Connection Timeouts
- Increase timeout values in JMeter HTTP Request Defaults
- Check network latency between load generators and API
- Verify SSL/TLS configuration for HTTPS

## Additional Resources

- [Azure Load Testing Documentation](https://learn.microsoft.com/en-us/azure/load-testing/)
- [JMeter User Manual](https://jmeter.apache.org/usermanual/index.html)
- [JMeter Best Practices](https://jmeter.apache.org/usermanual/best-practices.html)
- [Load Testing Best Practices](https://learn.microsoft.com/en-us/azure/load-testing/concept-load-testing-best-practices)
