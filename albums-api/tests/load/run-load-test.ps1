# PowerShell Script to Run Load Test in Azure Load Testing
# This script starts a load test run and optionally waits for completion

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup,
    
    [Parameter(Mandatory=$true)]
    [string]$LoadTestResource,
    
    [Parameter(Mandatory=$false)]
    [string]$TestName = "albums-api-progressive-load",
    
    [Parameter(Mandatory=$false)]
    [string]$TestRunName = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$Wait = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowResults = $false
)

$ErrorActionPreference = "Stop"

Write-Host "=== Running Load Test in Azure Load Testing ===" -ForegroundColor Green
Write-Host ""

# Check if Azure CLI is installed
try {
    $azVersion = az version --output json | ConvertFrom-Json
    Write-Host "✓ Azure CLI version: $($azVersion.'azure-cli')" -ForegroundColor Green
} catch {
    Write-Error "Azure CLI is not installed. Please install from https://aka.ms/installazurecli"
    exit 1
}

# Check if logged in to Azure
Write-Host "Checking Azure authentication..." -ForegroundColor Yellow
$account = az account show --output json 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Not logged in to Azure. Running 'az login'..." -ForegroundColor Yellow
    az login
    $account = az account show --output json | ConvertFrom-Json
}
Write-Host "✓ Logged in as: $($account.user.name)" -ForegroundColor Green
Write-Host ""

# Generate test run name if not provided
if ([string]::IsNullOrWhiteSpace($TestRunName)) {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $TestRunName = "$TestName-run-$timestamp"
}

Write-Host "Test Run Configuration:" -ForegroundColor Cyan
Write-Host "  Test ID: $TestName"
Write-Host "  Test Run Name: $TestRunName"
Write-Host "  Resource Group: $ResourceGroup"
Write-Host "  Load Test Resource: $LoadTestResource"
Write-Host ""

# Verify test exists
Write-Host "Verifying test exists..." -ForegroundColor Yellow
$testExists = az load test show `
    --test-id $TestName `
    --load-test-resource $LoadTestResource `
    --resource-group $ResourceGroup `
    --output json 2>$null

if (-not $testExists) {
    Write-Error "Test '$TestName' not found. Please deploy the test first using deploy-load-test.ps1"
    exit 1
}
Write-Host "✓ Test exists" -ForegroundColor Green
Write-Host ""

# Start the test run
Write-Host "Starting test run..." -ForegroundColor Yellow
Write-Host ""

try {
    $testRun = az load test-run create `
        --test-id $TestName `
        --test-run-id $TestRunName `
        --load-test-resource $LoadTestResource `
        --resource-group $ResourceGroup `
        --display-name "Load Test Run - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" `
        --description "Progressive load test execution" `
        --output json | ConvertFrom-Json
    
    Write-Host "✓ Test run started successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Display run information
    Write-Host "Test Run Details:" -ForegroundColor Cyan
    Write-Host "  Run ID: $($testRun.testRunId)"
    Write-Host "  Status: $($testRun.status)"
    Write-Host "  Start Time: $($testRun.startDateTime)"
    Write-Host ""
    
    # Provide Azure Portal link
    $portalUrl = "https://portal.azure.com/#@/resource/subscriptions/$($account.id)/resourceGroups/$ResourceGroup/providers/Microsoft.LoadTestService/loadtests/$LoadTestResource/testruns/$TestRunName"
    Write-Host "View in Azure Portal:" -ForegroundColor Cyan
    Write-Host "  $portalUrl" -ForegroundColor Blue
    Write-Host ""
    
    # Wait for completion if requested
    if ($Wait) {
        Write-Host "Waiting for test run to complete..." -ForegroundColor Yellow
        Write-Host "(This may take several minutes. Press Ctrl+C to stop monitoring)" -ForegroundColor Gray
        Write-Host ""
        
        $completed = $false
        $lastStatus = ""
        
        while (-not $completed) {
            Start-Sleep -Seconds 10
            
            $status = az load test-run show `
                --test-run-id $TestRunName `
                --load-test-resource $LoadTestResource `
                --resource-group $ResourceGroup `
                --output json | ConvertFrom-Json
            
            if ($status.status -ne $lastStatus) {
                Write-Host "Status: $($status.status)" -ForegroundColor Yellow
                $lastStatus = $status.status
            }
            
            $completed = @("DONE", "FAILED", "CANCELLED") -contains $status.status
        }
        
        Write-Host ""
        Write-Host "Test run completed with status: $($status.status)" -ForegroundColor $(if ($status.status -eq "DONE") { "Green" } else { "Red" })
        Write-Host ""
        
        # Show results if requested
        if ($ShowResults -and $status.status -eq "DONE") {
            Write-Host "Test Results Summary:" -ForegroundColor Cyan
            Write-Host "  Start Time: $($status.startDateTime)"
            Write-Host "  End Time: $($status.endDateTime)"
            Write-Host "  Duration: $($status.duration) seconds"
            Write-Host "  Virtual Users: $($status.virtualUsers)"
            
            if ($status.testResult) {
                Write-Host ""
                Write-Host "Performance Metrics:" -ForegroundColor Cyan
                Write-Host "  Total Requests: $($status.testResult.totalRequests)"
                Write-Host "  Failed Requests: $($status.testResult.failedRequests)"
                Write-Host "  Error Percentage: $($status.testResult.errorPercentage)%"
                Write-Host "  Avg Response Time: $($status.testResult.avgResponseTime) ms"
                Write-Host "  Min Response Time: $($status.testResult.minResponseTime) ms"
                Write-Host "  Max Response Time: $($status.testResult.maxResponseTime) ms"
                Write-Host "  Requests/sec: $($status.testResult.requestsPerSecond)"
            }
            
            Write-Host ""
            Write-Host "View detailed results in Azure Portal:" -ForegroundColor Cyan
            Write-Host "  $portalUrl" -ForegroundColor Blue
        }
    } else {
        Write-Host "Test is running in background." -ForegroundColor Yellow
        Write-Host "Monitor progress in Azure Portal or run with -Wait flag" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To check status later, run:" -ForegroundColor Cyan
        Write-Host "  az load test-run show --test-run-id $TestRunName --load-test-resource $LoadTestResource --resource-group $ResourceGroup" -ForegroundColor Gray
    }
    
} catch {
    Write-Error "Failed to run test: $_"
    exit 1
}

Write-Host ""
Write-Host "Load test execution initiated! ✓" -ForegroundColor Green
