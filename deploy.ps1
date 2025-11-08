# Azure Deployment Script for Albums API
# This script deploys the Albums API to Azure Container Apps using azd

Write-Host "=== Albums API Azure Deployment ===" -ForegroundColor Green

# Check if we're in the right directory
if (!(Test-Path "azure.yaml")) {
    Write-Error "azure.yaml not found. Please run this script from the project root."
    exit 1
}

# Set environment variables
$env:AZURE_ENV_NAME = "albums-api-dev"
$env:AZURE_LOCATION = "eastus"

Write-Host "Environment: $env:AZURE_ENV_NAME" -ForegroundColor Yellow
Write-Host "Location: $env:AZURE_LOCATION" -ForegroundColor Yellow

Write-Host "Step 1: Authenticating with Azure..." -ForegroundColor Blue
azd auth login

Write-Host "Step 2: Initializing AZD environment..." -ForegroundColor Blue
try {
    azd env select $env:AZURE_ENV_NAME
} catch {
    Write-Host "Environment doesn't exist, creating new one..." -ForegroundColor Yellow
    azd env new $env:AZURE_ENV_NAME
}

Write-Host "Step 3: Setting environment location..." -ForegroundColor Blue
azd env set AZURE_LOCATION $env:AZURE_LOCATION

Write-Host "Step 4: Provisioning Azure resources..." -ForegroundColor Blue
azd provision

Write-Host "Step 5: Building and deploying the application..." -ForegroundColor Blue
azd deploy

Write-Host "Step 6: Getting deployment information..." -ForegroundColor Blue
azd show

Write-Host "Deployment complete! 🚀" -ForegroundColor Green
Write-Host "Your API is now running on Azure Container Apps!" -ForegroundColor Green