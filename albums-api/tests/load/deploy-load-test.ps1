# PowerShell Script to Deploy Load Test to Azure Load Testing
# This script uploads the JMeter test plan and configuration to Azure Load Testing

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup,
    
    [Parameter(Mandatory=$true)]
    [string]$LoadTestResource,
    
    [Parameter(Mandatory=$false)]
    [string]$TestName = "albums-api-progressive-load",
    
    [Parameter(Mandatory=$false)]
    [string]$DisplayName = "Albums API - Progressive Load Test",
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "Progressive load test ramping from 0 to 1000 RPS"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Deploying Load Test to Azure Load Testing ===" -ForegroundColor Green
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
Write-Host "✓ Subscription: $($account.name) ($($account.id))" -ForegroundColor Green
Write-Host ""

# Verify Load Testing extension is installed
Write-Host "Checking Azure Load Testing extension..." -ForegroundColor Yellow
$extensions = az extension list --output json | ConvertFrom-Json
$loadExtension = $extensions | Where-Object { $_.name -eq "load" }

if (-not $loadExtension) {
    Write-Host "Installing Azure Load Testing extension..." -ForegroundColor Yellow
    az extension add --name load --yes
    Write-Host "✓ Extension installed" -ForegroundColor Green
} else {
    Write-Host "✓ Extension version: $($loadExtension.version)" -ForegroundColor Green
}
Write-Host ""

# Get script directory and test files
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jmeterFile = Join-Path $scriptDir "album-api-load-test.jmx"
$configFile = Join-Path $scriptDir "load-test.yaml"

# Verify files exist
if (-not (Test-Path $jmeterFile)) {
    Write-Error "JMeter file not found: $jmeterFile"
    exit 1
}

if (-not (Test-Path $configFile)) {
    Write-Error "Config file not found: $configFile"
    exit 1
}

Write-Host "✓ JMeter test plan: $jmeterFile" -ForegroundColor Green
Write-Host "✓ Load test config: $configFile" -ForegroundColor Green
Write-Host ""

# Check if Load Testing resource exists
Write-Host "Verifying Azure Load Testing resource..." -ForegroundColor Yellow
$loadTestExists = az load show `
    --name $LoadTestResource `
    --resource-group $ResourceGroup `
    --output json 2>$null

if (-not $loadTestExists) {
    Write-Host "Load Testing resource not found. Creating..." -ForegroundColor Yellow
    az load create `
        --name $LoadTestResource `
        --resource-group $ResourceGroup `
        --location eastus
    Write-Host "✓ Created Load Testing resource: $LoadTestResource" -ForegroundColor Green
} else {
    Write-Host "✓ Load Testing resource exists: $LoadTestResource" -ForegroundColor Green
}
Write-Host ""

# Check if test already exists
Write-Host "Checking if test already exists..." -ForegroundColor Yellow
$existingTest = az load test show `
    --test-id $TestName `
    --load-test-resource $LoadTestResource `
    --resource-group $ResourceGroup `
    --output json 2>$null

if ($existingTest) {
    Write-Host "Test '$TestName' already exists. Updating..." -ForegroundColor Yellow
    $createOrUpdate = "update"
} else {
    Write-Host "Creating new test '$TestName'..." -ForegroundColor Yellow
    $createOrUpdate = "create"
}

# Create or update the test
Write-Host ""
Write-Host "Uploading test configuration..." -ForegroundColor Yellow

try {
    if ($createOrUpdate -eq "create") {
        az load test create `
            --test-id $TestName `
            --load-test-resource $LoadTestResource `
            --resource-group $ResourceGroup `
            --display-name $DisplayName `
            --description $Description `
            --test-plan $jmeterFile `
            --load-test-config-file $configFile `
            --engine-instances 5
    } else {
        az load test update `
            --test-id $TestName `
            --load-test-resource $LoadTestResource `
            --resource-group $ResourceGroup `
            --display-name $DisplayName `
            --description $Description `
            --test-plan $jmeterFile `
            --load-test-config-file $configFile `
            --engine-instances 5
    }
    
    Write-Host ""
    Write-Host "✓ Test deployed successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Display test information
    Write-Host "Test Details:" -ForegroundColor Cyan
    Write-Host "  Test ID: $TestName"
    Write-Host "  Display Name: $DisplayName"
    Write-Host "  Resource Group: $ResourceGroup"
    Write-Host "  Load Test Resource: $LoadTestResource"
    Write-Host ""
    
    # Provide Azure Portal link
    $portalUrl = "https://portal.azure.com/#@/resource/subscriptions/$($account.id)/resourceGroups/$ResourceGroup/providers/Microsoft.LoadTestService/loadtests/$LoadTestResource/tests/$TestName"
    Write-Host "View in Azure Portal:" -ForegroundColor Cyan
    Write-Host "  $portalUrl" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Run the test using: .\run-load-test.ps1 -ResourceGroup $ResourceGroup -LoadTestResource $LoadTestResource -TestName $TestName"
    Write-Host "  2. Or run from Azure Portal: $portalUrl"
    Write-Host ""
    
} catch {
    Write-Error "Failed to deploy test: $_"
    exit 1
}

Write-Host "Deployment complete! ✓" -ForegroundColor Green
